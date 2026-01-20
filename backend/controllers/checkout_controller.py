from fastapi import APIRouter
from typing import List
from models.schemas import Order, CheckoutRequest
from services.business_logic import CheckoutService, OrderService

# Checkout and order history endpoints
router = APIRouter(tags=["Checkout & Orders"])

@router.post("/checkout", response_model=Order)
async def checkout(request: CheckoutRequest):
    return await CheckoutService.process_checkout(request)

@router.get("/orders", response_model=List[Order])
async def get_orders():
    return await OrderService.get_all_orders()

@router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    return await OrderService.get_order_by_id(order_id)
