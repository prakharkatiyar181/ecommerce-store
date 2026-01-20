from fastapi import APIRouter
from typing import List
from models.schemas import Product
from services.business_logic import ProductService

# Product endpoints - all operations are cached
router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[Product])
async def get_products():
    return await ProductService.get_all_products()

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    return await ProductService.get_product_by_id(product_id)
