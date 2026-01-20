from typing import List, Optional
from fastapi import HTTPException
from models.schemas import Product, Cart, CartItem, Order, CheckoutRequest, DiscountCode
from store.memory_store import store
from datetime import datetime
from services.cache import cached_with_ttl, invalidate_cache
import uuid

class ProductService:
    @staticmethod
    @cached_with_ttl(ttl=300, key_prefix="products")  # Cache for 5 minutes
    async def get_all_products() -> List[Product]:
        return list(store.products.values())
    
    @staticmethod
    async def get_product_by_id(product_id: str) -> Product:
        if product_id not in store.products:
            raise HTTPException(status_code=404, detail="Product not found")
        return store.products[product_id]

class CartService:
    @staticmethod
    async def create_cart() -> Cart:
        cart_id = str(uuid.uuid4())
        cart = Cart(id=cart_id, items=[], created_at=datetime.now())
        store.carts[cart_id] = cart
        return cart
    
    @staticmethod
    async def get_cart(cart_id: str) -> Cart:
        if cart_id not in store.carts:
            raise HTTPException(status_code=404, detail="Cart not found")
        return store.carts[cart_id]
    
    @staticmethod
    async def add_item_to_cart(cart_id: str, item: CartItem) -> dict:
        if cart_id not in store.carts:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        if item.product_id not in store.products:
            raise HTTPException(status_code=404, detail="Product not found")
        
        cart = store.carts[cart_id]
        
        existing_item = next((i for i in cart.items if i.product_id == item.product_id), None)
        if existing_item:
            existing_item.quantity += item.quantity
        else:
            cart.items.append(item)
        
        return {"message": "Item added to cart", "cart": cart}
    
    @staticmethod
    async def remove_item_from_cart(cart_id: str, product_id: str) -> dict:
        if cart_id not in store.carts:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        cart = store.carts[cart_id]
        cart.items = [item for item in cart.items if item.product_id != product_id]
        
        return {"message": "Item removed from cart", "cart": cart}
    
    @staticmethod
    async def update_item_quantity(cart_id: str, product_id: str, quantity: int) -> dict:
        if cart_id not in store.carts:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        cart = store.carts[cart_id]
        item = next((i for i in cart.items if i.product_id == product_id), None)
        
        if not item:
            raise HTTPException(status_code=404, detail="Item not found in cart")
        
        if quantity <= 0:
            cart.items = [i for i in cart.items if i.product_id != product_id]
        else:
            item.quantity = quantity
        
        return {"message": "Quantity updated", "cart": cart}

class CheckoutService:
    @staticmethod
    async def process_checkout(request: CheckoutRequest) -> Order:
        # Validate cart exists and has items
        if request.cart_id not in store.carts:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        cart = store.carts[request.cart_id]
        
        if not cart.items:
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        subtotal = sum(
            store.products[item.product_id].price * item.quantity 
            for item in cart.items
        )
        
        # Apply discount if code provided
        discount_amount = 0.0
        discount_code_used = None
        
        if request.discount_code:
            if request.discount_code not in store.discount_codes:
                raise HTTPException(status_code=400, detail="Invalid discount code")
            
            discount = store.discount_codes[request.discount_code]
            
            if discount.is_used:
                raise HTTPException(status_code=400, detail="Discount code already used")
            
            discount_amount = subtotal * 0.10
            discount.is_used = True
            discount_code_used = request.discount_code
        
        total = subtotal - discount_amount
        
        store.order_counter += 1
        order_id = str(uuid.uuid4())
        
        order = Order(
            id=order_id,
            cart_id=request.cart_id,
            items=cart.items.copy(),
            subtotal=subtotal,
            discount_amount=discount_amount,
            total=total,
            discount_code_used=discount_code_used,
            created_at=datetime.now()
        )
        
        store.orders[order_id] = order
        
        # Auto-generate discount code every nth order
        if store.order_counter % store.nth_order == 0:
            code = f"SAVE10-{str(uuid.uuid4())[:8].upper()}"
            discount_code = DiscountCode(
                code=code,
                order_number=store.order_counter,
                is_used=False,
                created_at=datetime.now()
            )
            store.discount_codes[code] = discount_code
        
        del store.carts[request.cart_id]
        
        # Invalidate cached stats after new order
        invalidate_cache("admin_stats")
        
        return order

class OrderService:
    @staticmethod
    async def get_all_orders() -> List[Order]:
        return list(store.orders.values())
    
    @staticmethod
    async def get_order_by_id(order_id: str) -> Order:
        if order_id not in store.orders:
            raise HTTPException(status_code=404, detail="Order not found")
        return store.orders[order_id]

class AdminService:
    @staticmethod
    async def generate_discount_code() -> dict:
        if store.order_counter % store.nth_order == 0:
            code = f"SAVE10-{str(uuid.uuid4())[:8].upper()}"
            discount_code = DiscountCode(
                code=code,
                order_number=store.order_counter,
                is_used=False,
                created_at=datetime.now()
            )
            store.discount_codes[code] = discount_code
            return {"message": "Discount code generated", "discount_code": discount_code}
        else:
            orders_until_next = store.nth_order - (store.order_counter % store.nth_order)
            return {
                "message": f"Discount not available yet. {orders_until_next} more orders needed.",
                "orders_until_next": orders_until_next
            }
    
    @staticmethod
    @cached_with_ttl(ttl=60, key_prefix="admin_stats")  # Cache for 1 minute
    async def get_statistics() -> dict:
        # Reuse orders collection for efficiency
        orders = store.orders.values()
        
        total_items_purchased = sum(
            sum(item.quantity for item in order.items)
            for order in orders
        )
        
        total_purchase_amount = sum(order.total for order in orders)
        total_discount_amount = sum(order.discount_amount for order in orders)
        
        discount_codes_list = [
            {
                "code": code.code,
                "order_number": code.order_number,
                "is_used": code.is_used,
                "created_at": code.created_at.isoformat()
            }
            for code in store.discount_codes.values()
        ]
        
        return {
            "total_items_purchased": total_items_purchased,
            "total_purchase_amount": round(total_purchase_amount, 2),
            "discount_codes": discount_codes_list,
            "total_discount_amount": round(total_discount_amount, 2),
            "total_orders": len(store.orders),
            "nth_order_value": store.nth_order
        }
