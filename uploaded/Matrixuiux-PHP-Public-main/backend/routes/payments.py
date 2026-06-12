"""Stripe payments via emergentintegrations hosted checkout.

Flow: frontend sends cart item ids + qty + customer info + origin_url.
Amounts are computed SERVER-SIDE from the products collection (never trust the client).
An order (pending_payment) and a payment_transactions record (initiated) are created
before redirecting to Stripe. Status endpoint polls Stripe and finalizes exactly once.
"""
import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, CheckoutSessionRequest,
)

from database import db
from auth_utils import get_user_from_request
from emails import fulfill_order

router = APIRouter()

PRO_ASSIST_PRICE = 47.00


class CheckoutItem(BaseModel):
    id: str
    qty: int = Field(default=1, ge=1, le=99)


class CustomerInfo(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: str = ""
    address: str = ""
    address2: str = ""
    country: str = "US"
    city: str = ""
    state: str = ""
    zip: str = ""


class CreateSessionRequest(BaseModel):
    items: List[CheckoutItem]
    pro_assist: bool = False
    payment_method: str = "card"
    origin_url: str
    customer: CustomerInfo


def _stripe(request: Request) -> StripeCheckout:
    host_url = str(request.base_url)
    return StripeCheckout(api_key=os.environ["STRIPE_API_KEY"], webhook_url=f"{host_url}api/webhook/stripe")


def _now_iso():
    return datetime.now(timezone.utc).isoformat()


def _order_number():
    return "UC" + datetime.now(timezone.utc).strftime("%y%m%d") + uuid.uuid4().hex[:5].upper()


@router.post("/payments/checkout/session")
async def create_checkout_session(req: CreateSessionRequest, request: Request):
    if not req.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Server-side pricing
    order_items = []
    subtotal = 0.0
    for item in req.items:
        product = await db.products.find_one({"id": item.id}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=400, detail=f"Unknown product: {item.id}")
        if not product.get("inStock", True):
            raise HTTPException(status_code=400, detail=f"'{product['name']}' is currently out of stock")
        subtotal += float(product["price"]) * item.qty
        order_items.append({
            "id": product["id"], "name": product["name"],
            "price": float(product["price"]), "qty": item.qty, "image": product.get("image"),
        })
    total = round(subtotal + (PRO_ASSIST_PRICE if req.pro_assist else 0.0), 2)
    if req.pro_assist:
        order_items.append({"id": "proassist-premium", "name": "ProAssist Premium Installation",
                            "price": PRO_ASSIST_PRICE, "qty": 1, "image": None})

    user = await get_user_from_request(request)
    order_id = f"order_{uuid.uuid4().hex[:12]}"
    order_number = _order_number()
    order = {
        "order_id": order_id,
        "order_number": order_number,
        "user_id": user["user_id"] if user else None,
        "email": req.customer.email.lower(),
        "customer": req.customer.model_dump(),
        "items": order_items,
        "subtotal": round(subtotal, 2),
        "pro_assist": req.pro_assist,
        "total": total,
        "currency": "usd",
        "payment_method": req.payment_method,
        "status": "pending_payment",
        "created_at": _now_iso(),
    }
    await db.orders.insert_one(dict(order))

    stripe_checkout = _stripe(request)
    success_url = f"{req.origin_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{req.origin_url}/checkout"
    # Epsilon guards against float truncation in the library's int(amount*100) cents
    # conversion (e.g. 79.99*100 = 7998.999... -> 7998). +0.1 cent never crosses a
    # cent boundary, so the charged amount is always exactly `total`.
    total_cents = round(total * 100)
    stripe_amount = (total_cents + 0.1) / 100.0
    session = await stripe_checkout.create_checkout_session(CheckoutSessionRequest(
        amount=stripe_amount,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"order_id": order_id, "order_number": order_number, "email": order["email"]},
    ))

    await db.payment_transactions.insert_one({
        "session_id": session.session_id,
        "order_id": order_id,
        "order_number": order_number,
        "email": order["email"],
        "user_id": order["user_id"],
        "amount": total,
        "currency": "usd",
        "metadata": {"order_id": order_id, "order_number": order_number},
        "payment_status": "initiated",
        "status": "open",
        "created_at": _now_iso(),
        "updated_at": _now_iso(),
    })
    await db.orders.update_one({"order_id": order_id}, {"$set": {"stripe_session_id": session.session_id}})
    return {"url": session.url, "session_id": session.session_id, "order_number": order_number}


async def _finalize_payment(session_id: str, payment_status: str, status: str):
    """Update transaction + order exactly once per successful payment."""
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not tx:
        return None
    if tx["payment_status"] == "paid":
        return tx  # already processed — never double-process
    update = {"payment_status": payment_status, "status": status, "updated_at": _now_iso()}
    await db.payment_transactions.update_one({"session_id": session_id}, {"$set": update})
    if payment_status == "paid":
        await db.orders.update_one({"order_id": tx["order_id"]},
                                   {"$set": {"status": "paid", "paid_at": _now_iso()}})
    elif status == "expired":
        await db.orders.update_one({"order_id": tx["order_id"]}, {"$set": {"status": "cancelled"}})
    return {**tx, **update}


@router.get("/payments/checkout/status/{session_id}")
async def checkout_status(session_id: str, request: Request):
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not tx:
        raise HTTPException(status_code=404, detail="Unknown session")

    stripe_checkout = _stripe(request)
    cs = await stripe_checkout.get_checkout_status(session_id)
    tx = await _finalize_payment(session_id, cs.payment_status, cs.status)

    order = await db.orders.find_one({"order_id": tx["order_id"]}, {"_id": 0})
    return {
        "status": cs.status,
        "payment_status": cs.payment_status,
        "amount_total": cs.amount_total,
        "currency": cs.currency,
        "order": order,
    }


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    stripe_checkout = _stripe(request)
    try:
        webhook = await stripe_checkout.handle_webhook(body, request.headers.get("Stripe-Signature"))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid webhook")
    if webhook.session_id:
        status = "complete" if webhook.payment_status == "paid" else "open"
        await _finalize_payment(webhook.session_id, webhook.payment_status, status)
    return {"ok": True}
