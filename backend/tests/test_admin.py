"""Tests for admin panel, license keys, leads and email fulfillment."""
import os
import uuid

import httpx
import pytest

BASE = "http://localhost:8001/api"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@ucodesofttechus.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Admin@UC2026!")


@pytest.fixture(scope="module")
def admin():
    c = httpx.Client(base_url=BASE, timeout=30)
    r = c.post("/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    # secure cookies aren't sent over plain http; use the JWT as a Bearer token instead
    c.headers["Authorization"] = f"Bearer {r.cookies['access_token']}"
    yield c
    c.close()


@pytest.fixture(scope="module")
def guest():
    with httpx.Client(base_url=BASE, timeout=30) as c:
        yield c


def test_admin_routes_require_admin(guest):
    for path in ("/admin/stats", "/admin/products", "/admin/orders", "/admin/leads", "/admin/keys", "/admin/emails"):
        assert guest.get(path).status_code == 401


def test_admin_stats(admin):
    r = admin.get("/admin/stats")
    assert r.status_code == 200
    body = r.json()
    assert body["products"] == 37


def test_admin_update_product(admin):
    r = admin.patch("/admin/products/windows-11-pro", json={"badge": "HOT DEAL", "inStock": True})
    assert r.status_code == 200
    assert r.json()["badge"] == "HOT DEAL"
    # restore
    r2 = admin.patch("/admin/products/windows-11-pro", json={"badge": "Best Seller"})
    assert r2.json()["badge"] == "Best Seller"


def test_out_of_stock_blocks_checkout(admin, guest):
    admin.patch("/admin/products/mcafee-premium-individual-1-year-unlimited-devices-usa", json={"inStock": False})
    r = guest.post("/payments/checkout/session", json={
        "items": [{"id": "mcafee-premium-individual-1-year-unlimited-devices-usa", "qty": 1}],
        "origin_url": "http://localhost:3000",
        "customer": {"email": "x@y.com", "first_name": "A", "last_name": "B"},
    })
    assert r.status_code == 400
    assert "out of stock" in r.json()["detail"].lower()
    admin.patch("/admin/products/mcafee-premium-individual-1-year-unlimited-devices-usa", json={"inStock": True})


def test_key_inventory_crud(admin):
    key_val = f"TEST{uuid.uuid4().hex[:5].upper()}-XXXXX-XXXXX-XXXXX-XXXXX"
    r = admin.post("/admin/keys", json={"product_id": "windows-11-pro", "keys": [key_val, "  ", ""]})
    assert r.status_code == 200
    assert r.json()["added"] == 1
    r2 = admin.get("/admin/keys", params={"product_id": "windows-11-pro"})
    keys = [k for k in r2.json()["keys"] if k["key"] == key_val]
    assert len(keys) == 1
    key_id = keys[0]["key_id"]
    assert admin.delete(f"/admin/keys/{key_id}").status_code == 200
    assert admin.delete(f"/admin/keys/{key_id}").status_code == 404


def test_leads_endpoint(guest, admin):
    sid = f"pytest-{uuid.uuid4().hex[:8]}"
    r = guest.post("/leads", json={
        "session_id": sid, "name": "Lead Tester", "email": "lead@test.com",
        "phone": "+1 555 000 1111", "callback_requested": True,
    })
    assert r.status_code == 200
    leads = admin.get("/admin/leads").json()
    match = [l for l in leads if l["session_id"] == sid]
    assert match and match[0]["callback_requested"] == True  # noqa: E712 — verify JSON true, not truthy


def test_fulfillment_assigns_key_and_queues_email(admin):
    """Simulate a paid order fulfillment: add key, create order via checkout, mark paid via resend-email path."""
    key_val = f"FULF{uuid.uuid4().hex[:5].upper()}-AAAAA-BBBBB-CCCCC-DDDDD"
    admin.post("/admin/keys", json={"product_id": "windows-10-pro", "keys": [key_val]})
    r = admin.post("/payments/checkout/session", json={
        "items": [{"id": "windows-10-pro", "qty": 1}],
        "origin_url": "http://localhost:3000",
        "customer": {"email": "fulfil@test.com", "first_name": "Ful", "last_name": "Fil"},
    })
    assert r.status_code == 200
    order_number = r.json()["order_number"]
    orders = admin.get("/admin/orders").json()
    order = next(o for o in orders if o["order_number"] == order_number)
    # trigger fulfillment via admin resend (order not yet fulfilled)
    rr = admin.post(f"/admin/orders/{order['order_id']}/resend-email")
    assert rr.status_code == 200
    orders = admin.get("/admin/orders").json()
    order = next(o for o in orders if o["order_number"] == order_number)
    assert order["fulfilled"] == True  # noqa: E712 — verify JSON true, not truthy
    assert order["license_keys"][0]["key"] == key_val
    emails = admin.get("/admin/emails").json()
    mail = [e for e in emails if e["order_id"] == order["order_id"]]
    assert mail and mail[0]["status"] in ("queued", "sent")
    preview = admin.get(f"/admin/emails/preview/{order['order_id']}")
    assert preview.status_code == 200
    assert key_val in preview.json()["html"]
    assert "UCODE SOFTTECH LLC" in preview.json()["html"]


def test_order_status_transitions(admin):
    """PATCH /api/admin/orders/{order_id} accepts valid statuses; rejects invalid with 400."""
    # create an order to mutate
    key_val = f"STAT{uuid.uuid4().hex[:5].upper()}-AAAAA-BBBBB-CCCCC-DDDDD"
    admin.post("/admin/keys", json={"product_id": "windows-11-pro", "keys": [key_val]})
    r = admin.post("/payments/checkout/session", json={
        "items": [{"id": "windows-11-pro", "qty": 1}],
        "origin_url": "http://localhost:3000",
        "customer": {"email": "status@test.com", "first_name": "St", "last_name": "Us"},
    })
    assert r.status_code == 200
    order_number = r.json()["order_number"]
    orders = admin.get("/admin/orders").json()
    order = next(o for o in orders if o["order_number"] == order_number)
    oid = order["order_id"]

    for status in ("paid", "delivered", "refunded", "cancelled"):
        rr = admin.patch(f"/admin/orders/{oid}", json={"status": status})
        assert rr.status_code == 200, f"{status} failed: {rr.text}"
        assert rr.json()["status"] == status

    bad = admin.patch(f"/admin/orders/{oid}", json={"status": "bogus_state"})
    assert bad.status_code == 400

    miss = admin.patch("/admin/orders/does-not-exist", json={"status": "paid"})
    assert miss.status_code == 404


def test_email_outbox_queued_when_no_resend_key(admin):
    """RESEND_API_KEY is empty by design → fulfillment emails must be 'queued', not 'sent'."""
    key_val = f"QUE{uuid.uuid4().hex[:5].upper()}-AAAAA-BBBBB-CCCCC-DDDDD"
    admin.post("/admin/keys", json={"product_id": "office-2024-professional-plus", "keys": [key_val]})
    r = admin.post("/payments/checkout/session", json={
        "items": [{"id": "office-2024-professional-plus", "qty": 1}],
        "origin_url": "http://localhost:3000",
        "customer": {"email": "queued@test.com", "first_name": "Q", "last_name": "U"},
    })
    assert r.status_code == 200
    order_number = r.json()["order_number"]
    order = next(o for o in admin.get("/admin/orders").json() if o["order_number"] == order_number)
    rr = admin.post(f"/admin/orders/{order['order_id']}/resend-email")
    assert rr.status_code == 200
    emails = admin.get("/admin/emails").json()
    mine = [e for e in emails if e["order_id"] == order["order_id"]]
    assert mine, "no email outbox record created"
    assert mine[0]["status"] == "queued", f"expected queued, got {mine[0]['status']}"

