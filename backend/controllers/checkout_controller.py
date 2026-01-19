from fastapi import APIRouter
from typing import List
from models.schemas import Order, CheckoutRequest
from services.business_logic import CheckoutService, OrderService

router = APIRouter(tags=["Checkout & Orders"])

@router.post("/checkout", response_model=Order)
def checkout(request: CheckoutRequest):
    return CheckoutService.process_checkout(request)

@router.get("/orders", response_model=List[Order])
def get_orders():
    return OrderService.get_all_orders()

@router.get("/orders/{order_id}", response_model=Order)
def get_order(order_id: str):
    return OrderService.get_order_by_id(order_id)
