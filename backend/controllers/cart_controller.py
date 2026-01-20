from fastapi import APIRouter
from models.schemas import Cart, CartItem
from services.business_logic import CartService

# Shopping cart endpoints - create, update, remove items
router = APIRouter(prefix="/cart", tags=["Cart"])

@router.post("", response_model=Cart)
async def create_cart():
    return await CartService.create_cart()

@router.get("/{cart_id}", response_model=Cart)
async def get_cart(cart_id: str):
    return await CartService.get_cart(cart_id)

@router.post("/{cart_id}/items")
async def add_to_cart(cart_id: str, item: CartItem):
    return await CartService.add_item_to_cart(cart_id, item)

@router.put("/{cart_id}/items/{product_id}")
async def update_cart_item_quantity(cart_id: str, product_id: str, quantity: int):
    return await CartService.update_item_quantity(cart_id, product_id, quantity)

@router.delete("/{cart_id}/items/{product_id}")
async def remove_from_cart(cart_id: str, product_id: str):
    return await CartService.remove_item_from_cart(cart_id, product_id)
