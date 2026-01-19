from typing import Dict
from models.schemas import Product, Cart, Order, DiscountCode
from datetime import datetime

class InMemoryStore:
    def __init__(self):
        self.products: Dict[str, Product] = {}
        self.carts: Dict[str, Cart] = {}
        self.orders: Dict[str, Order] = {}
        self.discount_codes: Dict[str, DiscountCode] = {}
        self.order_counter = 0
        self.nth_order = 3
        
        self._initialize_products()
    
    def _initialize_products(self):
        sample_products = [
            Product(id="1", name="Wireless Headphones", price=99.99, 
                   description="High-quality wireless headphones with noise cancellation",
                   image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"),
            Product(id="2", name="Smart Watch", price=299.99,
                   description="Fitness tracking smartwatch with heart rate monitor",
                   image_url="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80"),
            Product(id="3", name="AirPods Pro", price=249.99,
                   description="Wireless earbuds with active noise cancellation",
                   image_url="https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&q=80"),
            Product(id="4", name="Mechanical Keyboard", price=149.99,
                   description="RGB mechanical gaming keyboard with Red Switches",
                   image_url="https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80"),
            Product(id="5", name="Wireless Mouse", price=79.99,
                   description="Ergonomic wireless mouse with precision tracking",
                   image_url="https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80"),
            Product(id="6", name="4K Monitor", price=399.99,
                   description="27-inch 4K UHD monitor with HDR support",
                   image_url="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"),
        ]
        for product in sample_products:
            self.products[product.id] = product

store = InMemoryStore()
