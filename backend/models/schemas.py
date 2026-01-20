from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import List, Optional
from datetime import datetime

# Pydantic models with validation and auto-generated API docs

class Product(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # For ORM compatibility
    
    id: str = Field(..., description="Unique product identifier")
    name: str = Field(..., min_length=1, max_length=200, description="Product name")
    price: float = Field(..., gt=0, description="Product price in USD")
    description: str = Field(..., min_length=1, description="Product description")
    image_url: str = Field(..., description="Product image URL")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "1",
                "name": "Wireless Headphones",
                "price": 99.99,
                "description": "High-quality wireless headphones",
                "image_url": "https://example.com/image.jpg"
            }
        }
    )

class CartItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    product_id: str = Field(..., description="Product ID to add to cart")
    quantity: int = Field(..., gt=0, description="Quantity of items")
    
    @field_validator('quantity')
    @classmethod
    def validate_quantity(cls, v):
        if v <= 0:
            raise ValueError('Quantity must be greater than 0')
        return v

class Cart(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str = Field(..., description="Unique cart identifier")
    items: List[CartItem] = Field(default_factory=list, description="Cart items")
    created_at: datetime = Field(..., description="Cart creation timestamp")

class CheckoutRequest(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    cart_id: str = Field(..., description="Cart ID to checkout")
    discount_code: Optional[str] = Field(None, description="Optional discount code")

class Order(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str = Field(..., description="Unique order identifier")
    cart_id: str = Field(..., description="Associated cart ID")
    items: List[CartItem] = Field(..., description="Order items")
    subtotal: float = Field(..., ge=0, description="Order subtotal")
    discount_amount: float = Field(..., ge=0, description="Discount amount applied")
    total: float = Field(..., ge=0, description="Order total after discount")
    discount_code_used: Optional[str] = Field(None, description="Discount code used")
    created_at: datetime = Field(..., description="Order creation timestamp")

class DiscountCode(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    code: str = Field(..., description="Discount code")
    order_number: int = Field(..., description="Order number that triggered generation")
    is_used: bool = Field(..., description="Whether code has been used")
    created_at: datetime = Field(..., description="Code creation timestamp")
