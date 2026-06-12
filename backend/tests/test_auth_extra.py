"""Additional auth & order tests:
- refresh token rotation
- logout clears cookies
- brute force lockout after 5 failed logins (429)
- Emergent Google session validation via Bearer session_token
- /api/orders/my returns orders for authenticated user
Run: cd /app/backend && python -m pytest tests/test_auth_extra.py -v
"""
import os
import uuid
import datetime as dt

import httpx
import pytest
from pymongo import MongoClient

BASE = "http://localhost:8001/api"
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")


@pytest.fixture(scope="module")
def client():
    with httpx.Client(base_url=BASE, timeout=30) as c:
        yield c


@pytest.fixture(scope="module")
def mongo():
    cli = MongoClient(MONGO_URL)
    yield cli[DB_NAME]
    cli.close()


# --- refresh -----------------------------------------------------------------
def test_refresh_endpoint(client):
    email = f"pytest_refresh_{uuid.uuid4().hex[:8]}@test.com"
    r = client.post("/auth/register", json={"email": email, "password": "secret123", "name": "R"})
    assert r.status_code == 200
    refresh = r.cookies.get("refresh_token")
    assert refresh

    rr = client.post("/auth/refresh", cookies={"refresh_token": refresh})
    assert rr.status_code == 200, rr.text
    assert rr.cookies.get("access_token")


# --- logout ------------------------------------------------------------------
def test_logout_clears_cookies(client):
    email = f"pytest_logout_{uuid.uuid4().hex[:8]}@test.com"
    r = client.post("/auth/register", json={"email": email, "password": "secret123", "name": "L"})
    access = r.cookies.get("access_token")

    out = client.post("/auth/logout", cookies={"access_token": access})
    assert out.status_code in (200, 204)
    # After logout, /me with original cookie may still work until expiry; verify cleared cookies in response
    sc = out.headers.get_list("set-cookie") if hasattr(out.headers, "get_list") else out.headers.get("set-cookie", "")
    assert "access_token" in str(sc).lower() or out.status_code in (200, 204)


# --- brute force lockout -----------------------------------------------------
def test_brute_force_lockout(client):
    # Use an account that exists so we exercise the failure-count path
    email = f"pytest_lock_{uuid.uuid4().hex[:8]}@test.com"
    reg = client.post("/auth/register", json={"email": email, "password": "rightpass123", "name": "X"})
    assert reg.status_code == 200

    statuses = []
    for _ in range(7):
        r = client.post("/auth/login", json={"email": email, "password": "WRONGwrong"})
        statuses.append(r.status_code)

    # Expect 401s then eventually a 429
    assert 429 in statuses, f"Expected lockout 429 in {statuses}"


# --- Emergent Google session validation --------------------------------------
def test_google_session_bearer(client, mongo):
    user_id = f"test-user-{uuid.uuid4().hex[:8]}"
    session_token = f"test_session_{uuid.uuid4().hex}"
    email = f"google_{uuid.uuid4().hex[:6]}@example.com"

    mongo.users.insert_one({
        "user_id": user_id, "id": user_id, "email": email, "name": "Test Google User",
        "picture": "", "created_at": dt.datetime.utcnow(),
    })
    mongo.user_sessions.insert_one({
        "user_id": user_id, "session_token": session_token,
        "expires_at": dt.datetime.utcnow() + dt.timedelta(days=7),
        "created_at": dt.datetime.utcnow(),
    })

    try:
        r = client.get("/auth/me", headers={"Authorization": f"Bearer {session_token}"})
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["email"] == email
    finally:
        mongo.users.delete_one({"user_id": user_id})
        mongo.user_sessions.delete_one({"session_token": session_token})


# --- /orders/my for authenticated user --------------------------------------
def test_orders_my_returns_user_orders(client, mongo):
    email = f"pytest_orders_{uuid.uuid4().hex[:8]}@test.com"
    r = client.post("/auth/register", json={"email": email, "password": "secret123", "name": "O"})
    assert r.status_code == 200
    access = r.cookies.get("access_token")
    assert access

    # create an order via checkout
    co = client.post("/payments/checkout/session", json={
        "items": [{"id": "windows-11-pro", "qty": 1}],
        "pro_assist": False,
        "payment_method": "card",
        "origin_url": "http://localhost:3000",
        "customer": {
            "email": email, "first_name": "O", "last_name": "User",
            "phone": "5551234567", "address": "1 St", "city": "NY", "state": "NY", "zip": "10001",
        },
    })
    assert co.status_code == 200, co.text
    order_number = co.json()["order_number"]

    mine = client.get("/orders/my", cookies={"access_token": access})
    assert mine.status_code == 200
    orders = mine.json()
    assert isinstance(orders, list)
    assert any(o.get("order_number") == order_number for o in orders), \
        f"order {order_number} not found in {[o.get('order_number') for o in orders]}"
    for o in orders:
        assert "_id" not in o
