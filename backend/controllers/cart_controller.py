from fastapi import APIRouter
from models.schemas import Cart, CartItem
from services.business_logic import CartService

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.post("", response_model=Cart)
def create_cart():
    return CartService.create_cart()

@router.get("/{cart_id}", response_model=Cart)
def get_cart(cart_id: str):
    return CartService.get_cart(cart_id)

@router.post("/{cart_id}/items")
def add_to_cart(cart_id: str, item: CartItem):
    return CartService.add_item_to_cart(cart_id, item)

@router.put("/{cart_id}/items/{product_id}")
def update_cart_item_quantity(cart_id: str, product_id: str, quantity: int):
    return CartService.update_item_quantity(cart_id, product_id, quantity)

@router.delete("/{cart_id}/items/{product_id}")
def remove_from_cart(cart_id: str, product_id: str):
    return CartService.remove_item_from_cart(cart_id, product_id)
