"""Idempotent seeding: product catalog from seed_data.json + admin user + indexes."""
import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path

from database import db
from auth_utils import hash_password, verify_password

logger = logging.getLogger(__name__)
SEED_FILE = Path(__file__).parent / "seed_data.json"


async def ensure_indexes():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("user_id", unique=True)
    await db.user_sessions.create_index("session_token")
    await db.login_attempts.create_index("identifier")
    await db.products.create_index("id", unique=True)
    await db.orders.create_index("order_id", unique=True)
    await db.orders.create_index("email")
    await db.payment_transactions.create_index("session_id", unique=True)


async def seed_catalog():
    data = json.loads(SEED_FILE.read_text())
    for product in data["products"]:
        await db.products.update_one({"id": product["id"]}, {"$set": product}, upsert=True)
    for category in data["categories"]:
        await db.categories.update_one({"slug": category["slug"]}, {"$set": category}, upsert=True)
    count = await db.products.count_documents({})
    logger.info(f"Catalog seeded: {count} products")


async def seed_admin():
    import uuid
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "user_id": f"user_{uuid.uuid4().hex[:12]}",
            "email": admin_email,
            "name": "Admin",
            "password_hash": hash_password(admin_password),
            "picture": None,
            "role": "admin",
            "auth_provider": "password",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin user created")
    elif not verify_password(admin_password, existing.get("password_hash") or ""):
        await db.users.update_one({"email": admin_email},
                                  {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated from .env")


async def seed_all():
    await ensure_indexes()
    await seed_catalog()
    await seed_admin()
