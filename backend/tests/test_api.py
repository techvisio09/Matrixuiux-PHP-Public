"""API regression tests. Run: cd /app/backend && python -m pytest tests/ -v"""
import os
import uuid

import httpx
import pytest

BASE = "http://localhost:8001/api"


@pytest.fixture(scope="module")
def client():
    with httpx.Client(base_url=BASE, timeout=30) as c:
        yield c


def test_root(client):
    r = client.get("/")
    assert r.status_code == 200


def test_products_list(client):
    r = client.get("/products")
    assert r.status_code == 200
    products = r.json()
    assert len(products) == 37
    p = products[0]
    for field in ("id", "name", "price", "rating", "image", "apps", "category"):
        assert field in p
    assert "_id" not in p


def test_product_detail(client):
    r = client.get("/products/windows-11-pro")
    assert r.status_code == 200
    assert r.json()["name"] == "Windows 11 Pro"
    assert client.get("/products/nonexistent-xyz").status_code == 404


def test_categories(client):
    r = client.get("/categories")
    assert r.status_code == 200
    assert len(r.json()) >= 12


def test_register_login_me_flow(client):
    email = f"pytest_{uuid.uuid4().hex[:8]}@test.com"
    r = client.post("/auth/register", json={"email": email, "password": "secret123", "name": "Py Test"})
    assert r.status_code == 200
    user = r.json()
    assert user["email"] == email
    assert "password_hash" not in user
    assert "access_token" in r.cookies

    # me with cookie
    r2 = client.get("/auth/me", cookies={"access_token": r.cookies["access_token"]})
    assert r2.status_code == 200
    assert r2.json()["email"] == email

    # login
    r3 = client.post("/auth/login", json={"email": email, "password": "secret123"})
    assert r3.status_code == 200

    # wrong password
    r4 = client.post("/auth/login", json={"email": email, "password": "wrongpass"})
    assert r4.status_code == 401


def test_admin_login(client):
    r = client.post("/auth/login", json={
        "email": os.environ.get("ADMIN_EMAIL", "admin@ucodesofttechus.com"),
        "password": os.environ.get("ADMIN_PASSWORD", "Admin@UC2026!"),
    })
    assert r.status_code == 200
    assert r.json()["role"] == "admin"


def test_me_unauthenticated(client):
    r = client.get("/auth/me")
    assert r.status_code == 401


def test_checkout_session_creates_order(client):
    r = client.post("/payments/checkout/session", json={
        "items": [{"id": "windows-11-pro", "qty": 2}],
        "pro_assist": True,
        "payment_method": "card",
        "origin_url": "http://localhost:3000",
        "customer": {
            "email": "pytest-buyer@test.com", "first_name": "Py", "last_name": "Buyer",
            "phone": "5551234567", "address": "1 Main St", "city": "NYC", "state": "NY", "zip": "10001",
        },
    })
    assert r.status_code == 200
    data = r.json()
    assert data["url"].startswith("https://")
    assert data["session_id"]
    assert data["order_number"].startswith("UC")

    # status endpoint should know the session (unpaid)
    r2 = client.get(f"/payments/checkout/status/{data['session_id']}")
    assert r2.status_code == 200
    body = r2.json()
    assert body["payment_status"] != "paid"
    assert body["order"]["total"] == round(79.99 * 2 + 47.0, 2)


def test_checkout_rejects_unknown_product(client):
    r = client.post("/payments/checkout/session", json={
        "items": [{"id": "fake-product", "qty": 1}],
        "origin_url": "http://localhost:3000",
        "customer": {"email": "a@b.com", "first_name": "A", "last_name": "B"},
    })
    assert r.status_code == 400


def test_orders_my_requires_auth(client):
    assert client.get("/orders/my").status_code == 401
