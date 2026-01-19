import pytest
from fastapi.testclient import TestClient
from main import app
from store.memory_store import store

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_store():
    store.carts.clear()
    store.orders.clear()
    store.discount_codes.clear()
    store.order_counter = 0
    yield

def test_get_products():
    response = client.get("/products")
    assert response.status_code == 200
    products = response.json()
    assert len(products) > 0
    assert "id" in products[0]
    assert "name" in products[0]
    assert "price" in products[0]

def test_get_single_product():
    response = client.get("/products/1")
    assert response.status_code == 200
    product = response.json()
    assert product["id"] == "1"
    assert product["name"] == "Wireless Headphones"

def test_create_cart():
    response = client.post("/cart")
    assert response.status_code == 200
    cart = response.json()
    assert "id" in cart
    assert cart["items"] == []

def test_add_to_cart():
    cart_response = client.post("/cart")
    cart_id = cart_response.json()["id"]
    
    response = client.post(
        f"/cart/{cart_id}/items",
        json={"product_id": "1", "quantity": 2}
    )
    assert response.status_code == 200
    cart = response.json()["cart"]
    assert len(cart["items"]) == 1
    assert cart["items"][0]["product_id"] == "1"
    assert cart["items"][0]["quantity"] == 2

def test_add_same_product_twice():
    cart_response = client.post("/cart")
    cart_id = cart_response.json()["id"]
    
    client.post(f"/cart/{cart_id}/items", json={"product_id": "1", "quantity": 1})
    response = client.post(f"/cart/{cart_id}/items", json={"product_id": "1", "quantity": 2})
    
    cart = response.json()["cart"]
    assert len(cart["items"]) == 1
    assert cart["items"][0]["quantity"] == 3

def test_remove_from_cart():
    cart_response = client.post("/cart")
    cart_id = cart_response.json()["id"]
    
    client.post(f"/cart/{cart_id}/items", json={"product_id": "1", "quantity": 2})
    response = client.delete(f"/cart/{cart_id}/items/1")
    
    assert response.status_code == 200
    cart = response.json()["cart"]
    assert len(cart["items"]) == 0

def test_checkout_without_discount():
    cart_response = client.post("/cart")
    cart_id = cart_response.json()["id"]
    
    client.post(f"/cart/{cart_id}/items", json={"product_id": "1", "quantity": 1})
    
    response = client.post("/checkout", json={"cart_id": cart_id})
    assert response.status_code == 200
    order = response.json()
    assert order["subtotal"] == 99.99
    assert order["discount_amount"] == 0.0
    assert order["total"] == 99.99

def test_checkout_empty_cart():
    cart_response = client.post("/cart")
    cart_id = cart_response.json()["id"]
    
    response = client.post("/checkout", json={"cart_id": cart_id})
    assert response.status_code == 400
    assert "Cart is empty" in response.json()["detail"]

def test_nth_order_discount_generation():
    for i in range(3):
        cart_response = client.post("/cart")
        cart_id = cart_response.json()["id"]
        client.post(f"/cart/{cart_id}/items", json={"product_id": "1", "quantity": 1})
        client.post("/checkout", json={"cart_id": cart_id})
    
    stats = client.get("/admin/statistics").json()
    assert len(stats["discount_codes"]) == 1
    assert stats["discount_codes"][0]["order_number"] == 3

def test_checkout_with_valid_discount():
    for i in range(3):
        cart_response = client.post("/cart")
        cart_id = cart_response.json()["id"]
        client.post(f"/cart/{cart_id}/items", json={"product_id": "1", "quantity": 1})
        client.post("/checkout", json={"cart_id": cart_id})
    
    stats = client.get("/admin/statistics").json()
    discount_code = stats["discount_codes"][0]["code"]
    
    cart_response = client.post("/cart")
    cart_id = cart_response.json()["id"]
    client.post(f"/cart/{cart_id}/items", json={"product_id": "2", "quantity": 1})
    
    response = client.post("/checkout", json={"cart_id": cart_id, "discount_code": discount_code})
    assert response.status_code == 200
    order = response.json()
    assert order["subtotal"] == 299.99
    assert order["discount_amount"] == 29.999
    assert abs(order["total"] - 269.991) < 0.01

def test_checkout_with_invalid_discount():
    cart_response = client.post("/cart")
    cart_id = cart_response.json()["id"]
    client.post(f"/cart/{cart_id}/items", json={"product_id": "1", "quantity": 1})
    
    response = client.post("/checkout", json={"cart_id": cart_id, "discount_code": "INVALID123"})
    assert response.status_code == 400
    assert "Invalid discount code" in response.json()["detail"]

def test_checkout_with_used_discount():
    for i in range(3):
        cart_response = client.post("/cart")
        cart_id = cart_response.json()["id"]
        client.post(f"/cart/{cart_id}/items", json={"product_id": "1", "quantity": 1})
        client.post("/checkout", json={"cart_id": cart_id})
    
    stats = client.get("/admin/statistics").json()
    discount_code = stats["discount_codes"][0]["code"]
    
    cart_response = client.post("/cart")
    cart_id = cart_response.json()["id"]
    client.post(f"/cart/{cart_id}/items", json={"product_id": "1", "quantity": 1})
    client.post("/checkout", json={"cart_id": cart_id, "discount_code": discount_code})
    
    cart_response = client.post("/cart")
    cart_id = cart_response.json()["id"]
    client.post(f"/cart/{cart_id}/items", json={"product_id": "1", "quantity": 1})
    response = client.post("/checkout", json={"cart_id": cart_id, "discount_code": discount_code})
    
    assert response.status_code == 400
    assert "already used" in response.json()["detail"]

def test_admin_statistics():
    cart_response = client.post("/cart")
    cart_id = cart_response.json()["id"]
    client.post(f"/cart/{cart_id}/items", json={"product_id": "1", "quantity": 2})
    client.post(f"/cart/{cart_id}/items", json={"product_id": "2", "quantity": 1})
    client.post("/checkout", json={"cart_id": cart_id})
    
    response = client.get("/admin/statistics")
    assert response.status_code == 200
    stats = response.json()
    assert stats["total_items_purchased"] == 3
    assert stats["total_orders"] == 1
    assert stats["nth_order_value"] == 3

def test_generate_discount_admin():
    for i in range(3):
        cart_response = client.post("/cart")
        cart_id = cart_response.json()["id"]
        client.post(f"/cart/{cart_id}/items", json={"product_id": "1", "quantity": 1})
        client.post("/checkout", json={"cart_id": cart_id})
    
    response = client.post("/admin/generate-discount")
    assert response.status_code == 200
    assert "Discount not available yet" in response.json()["message"]
