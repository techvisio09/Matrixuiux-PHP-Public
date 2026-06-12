"""Catalog endpoints: products and categories (read-only)."""
from typing import Optional

from fastapi import APIRouter, HTTPException

from database import db

router = APIRouter()


@router.get("/products")
async def list_products(category: Optional[str] = None):
    query = {"category": category} if category else {}
    return await db.products.find(query, {"_id": 0}).sort("sort_order", 1).to_list(500)


@router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/categories")
async def list_categories():
    return await db.categories.find({}, {"_id": 0}).to_list(100)
