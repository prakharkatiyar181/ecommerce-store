from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Product(BaseModel):
    id: str
    name: str
    price: float
    description: str
    image_url: str

class CartItem(BaseModel):
    product_id: str
    quantity: int

class Cart(BaseModel):
    id: str
    items: List[CartItem] = []
    created_at: datetime

class CheckoutRequest(BaseModel):
    cart_id: str
    discount_code: Optional[str] = None

class Order(BaseModel):
    id: str
    cart_id: str
    items: List[CartItem]
    subtotal: float
    discount_amount: float
    total: float
    discount_code_used: Optional[str]
    created_at: datetime

class DiscountCode(BaseModel):
    code: str
    order_number: int
    is_used: bool
    created_at: datetime
