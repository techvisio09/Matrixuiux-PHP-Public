"""Admin panel API: products, orders, leads, license key inventory, email outbox."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel

from database import db
from auth_utils import get_current_user
from emails import fulfill_order, build_order_email_html, send_email

router = APIRouter(prefix="/admin")


async def require_admin(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


class ProductUpdate(BaseModel):
    price: Optional[float] = None
    originalPrice: Optional[float] = None
    badge: Optional[str] = None
    isNew: Optional[bool] = None
    inStock: Optional[bool] = None


class OrderUpdate(BaseModel):
    status: str


class KeysCreate(BaseModel):
    product_id: str
    keys: List[str]


@router.get("/stats")
async def stats(_: dict = Depends(require_admin)):
    return {
        "products": await db.products.count_documents({}),
        "orders": await db.orders.count_documents({}),
        "paid_orders": await db.orders.count_documents({"status": "paid"}),
        "leads": await db.leads.count_documents({}),
        "keys_available": await db.license_keys.count_documents({"status": "available"}),
        "emails_queued": await db.email_outbox.count_documents({"status": "queued"}),
    }


# ---------------- sales dashboard ----------------
REVENUE_STATUSES = {"status": {"$in": ["paid", "delivered"]}}


@router.get("/dashboard")
async def dashboard(_: dict = Depends(require_admin)):
    from datetime import datetime, timedelta, timezone

    now = datetime.now(timezone.utc)
    cutoff = (now - timedelta(days=29)).strftime("%Y-%m-%d")

    totals = await db.orders.aggregate([
        {"$match": REVENUE_STATUSES},
        {"$group": {"_id": None, "revenue": {"$sum": "$total"}, "orders": {"$sum": 1}}},
    ]).to_list(1)
    revenue = totals[0]["revenue"] if totals else 0.0
    paid_count = totals[0]["orders"] if totals else 0

    # Revenue per day over the last 30 days (created_at is an ISO string → first 10 chars = YYYY-MM-DD)
    by_day_rows = await db.orders.aggregate([
        {"$match": {**REVENUE_STATUSES, "created_at": {"$gte": cutoff}}},
        {"$group": {"_id": {"$substrBytes": ["$created_at", 0, 10]},
                    "revenue": {"$sum": "$total"}, "orders": {"$sum": 1}}},
    ]).to_list(40)
    day_map = {r["_id"]: r for r in by_day_rows}
    revenue_by_day = []
    for i in range(29, -1, -1):
        d = (now - timedelta(days=i)).strftime("%Y-%m-%d")
        row = day_map.get(d)
        revenue_by_day.append({
            "date": d,
            "revenue": round(row["revenue"], 2) if row else 0,
            "orders": row["orders"] if row else 0,
        })

    best = await db.orders.aggregate([
        {"$match": REVENUE_STATUSES},
        {"$unwind": "$items"},
        {"$group": {"_id": "$items.id",
                    "name": {"$last": "$items.name"},
                    "image": {"$last": "$items.image"},
                    "units": {"$sum": "$items.qty"},
                    "revenue": {"$sum": {"$multiply": ["$items.price", "$items.qty"]}}}},
        {"$sort": {"units": -1}},
        {"$limit": 8},
    ]).to_list(8)
    best_sellers = [{"id": b["_id"], "name": b["name"], "image": b.get("image"),
                     "units": b["units"], "revenue": round(b["revenue"], 2)} for b in best]

    revenue_7d = sum(d["revenue"] for d in revenue_by_day[-7:])
    return {
        "summary": {
            "total_revenue": round(revenue, 2),
            "paid_orders": paid_count,
            "avg_order_value": round(revenue / paid_count, 2) if paid_count else 0,
            "revenue_7d": round(revenue_7d, 2),
        },
        "revenue_by_day": revenue_by_day,
        "best_sellers": best_sellers,
    }


# ---------------- products ----------------
@router.get("/products")
async def admin_products(_: dict = Depends(require_admin)):
    return await db.products.find({}, {"_id": 0}).sort("sort_order", 1).to_list(500)


@router.patch("/products/{product_id}")
async def update_product(product_id: str, body: ProductUpdate, _: dict = Depends(require_admin)):
    update = {k: v for k, v in body.model_dump().items() if v is not None}
    if body.badge == "":
        update["badge"] = None
    if not update:
        raise HTTPException(status_code=400, detail="Nothing to update")
    result = await db.products.update_one({"id": product_id}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return await db.products.find_one({"id": product_id}, {"_id": 0})


# ---------------- orders ----------------
@router.get("/orders")
async def admin_orders(_: dict = Depends(require_admin)):
    return await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@router.patch("/orders/{order_id}")
async def update_order(order_id: str, body: OrderUpdate, _: dict = Depends(require_admin)):
    if body.status not in ("pending_payment", "paid", "delivered", "refunded", "cancelled"):
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.orders.update_one({"order_id": order_id}, {"$set": {"status": body.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return await db.orders.find_one({"order_id": order_id}, {"_id": 0})


@router.post("/orders/{order_id}/resend-email")
async def resend_order_email(order_id: str, _: dict = Depends(require_admin)):
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if not order.get("fulfilled"):
        await fulfill_order(order_id)
        return {"ok": True, "action": "fulfilled"}
    assignments = [{"product_id": k["product_id"], "name": k["name"], "key": k["key"],
                    "image": next((i.get("image") for i in order["items"] if i["id"] == k["product_id"]), None)}
                   for k in order.get("license_keys", [])]
    html = build_order_email_html(order, assignments)
    await send_email(order["email"], f"Your Microsoft product key — Order #{order['order_number']}", html, order_id=order_id)
    return {"ok": True, "action": "resent"}


# ---------------- leads ----------------
@router.get("/leads")
async def admin_leads(_: dict = Depends(require_admin)):
    return await db.leads.find({}, {"_id": 0}).sort("ts", -1).to_list(500)


# ---------------- license key inventory ----------------
@router.get("/keys")
async def admin_keys(product_id: Optional[str] = None, _: dict = Depends(require_admin)):
    query = {"product_id": product_id} if product_id else {}
    keys = await db.license_keys.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    pipeline = [{"$group": {"_id": {"product_id": "$product_id", "status": "$status"}, "count": {"$sum": 1}}}]
    counts = {}
    async for row in db.license_keys.aggregate(pipeline):
        pid = row["_id"]["product_id"]
        counts.setdefault(pid, {"available": 0, "assigned": 0})
        counts[pid][row["_id"]["status"]] = row["count"]
    return {"keys": keys, "counts": counts}


@router.post("/keys")
async def add_keys(body: KeysCreate, _: dict = Depends(require_admin)):
    import uuid
    from datetime import datetime, timezone
    if not await db.products.find_one({"id": body.product_id}):
        raise HTTPException(status_code=404, detail="Product not found")
    cleaned = [k.strip() for k in body.keys if k.strip()]
    if not cleaned:
        raise HTTPException(status_code=400, detail="No keys provided")
    docs = [{
        "key_id": f"key_{uuid.uuid4().hex[:10]}",
        "product_id": body.product_id,
        "key": k,
        "status": "available",
        "order_id": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    } for k in cleaned]
    await db.license_keys.insert_many(docs)
    return {"ok": True, "added": len(docs)}


@router.delete("/keys/{key_id}")
async def delete_key(key_id: str, _: dict = Depends(require_admin)):
    result = await db.license_keys.delete_one({"key_id": key_id, "status": "available"})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Key not found or already assigned")
    return {"ok": True}


# ---------------- email outbox ----------------
@router.get("/emails")
async def admin_emails(_: dict = Depends(require_admin)):
    return await db.email_outbox.find({}, {"_id": 0, "html": 0}).sort("created_at", -1).to_list(200)


@router.get("/emails/preview/{order_id}")
async def email_preview(order_id: str, _: dict = Depends(require_admin)):
    rec = await db.email_outbox.find_one({"order_id": order_id}, {"_id": 0}, sort=[("created_at", -1)])
    if not rec:
        raise HTTPException(status_code=404, detail="No email for this order")
    return {"html": rec["html"], "to": rec["to"], "subject": rec["subject"], "status": rec["status"]}
