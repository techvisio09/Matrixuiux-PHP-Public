"""Orders: list the authenticated user's orders."""
from fastapi import APIRouter, Depends

from database import db
from auth_utils import get_current_user

router = APIRouter()


@router.get("/orders/my")
async def my_orders(user: dict = Depends(get_current_user)):
    query = {"$or": [{"user_id": user["user_id"]}, {"email": user["email"]}]}
    return await db.orders.find(query, {"_id": 0}).sort("created_at", -1).to_list(200)
