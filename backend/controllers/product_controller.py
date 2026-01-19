from fastapi import APIRouter
from typing import List
from models.schemas import Product
from services.business_logic import ProductService

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[Product])
def get_products():
    return ProductService.get_all_products()

@router.get("/{product_id}", response_model=Product)
def get_product(product_id: str):
    return ProductService.get_product_by_id(product_id)
