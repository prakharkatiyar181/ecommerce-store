# Ecommerce Store

A full-stack ecommerce application with cart management, checkout with discount codes, and admin dashboard.

## Features

### Customer Features
- Browse products with modern UI
- Add items to cart
- Apply discount codes at checkout
- View order summary

### Admin Features
- View statistics (orders, revenue, items sold)
- Track discount codes
- Monitor discount usage

### Discount System
- Every **3rd order** automatically generates a 10% discount code
- Discount codes can be used only once
- Discount applies to entire order

## Technology Stack

### Backend
- FastAPI (Python web framework)
- Pydantic (data validation)
- In-memory storage
- RESTful API architecture

### Frontend
- React 19
- Vite (build tool)
- Axios (HTTP client)
- Modern CSS with gradients and animations

### Testing
- pytest
- FastAPI TestClient
- Comprehensive unit tests

## Project Structure

```
ecommerce-store/
├── backend/
│   ├── models/
│   │   └── schemas.py        # Pydantic data models
│   ├── controllers/
│   │   ├── product_controller.py
│   │   ├── cart_controller.py
│   │   ├── checkout_controller.py
│   │   └── admin_controller.py
│   ├── services/
│   │   └── business_logic.py # Business logic layer
│   ├── store/
│   │   └── memory_store.py   # Data storage
│   ├── main.py               # FastAPI app (MVC)
│   ├── test_main.py          # Unit tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main component
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Styles
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment (recommended):
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Running Tests

Navigate to backend directory and run:

```bash
pytest test_main.py -v
```

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Main Endpoints

#### Products
- `GET /products` - Get all products
- `GET /products/{product_id}` - Get single product

#### Cart
- `POST /cart` - Create new cart
- `GET /cart/{cart_id}` - Get cart details
- `POST /cart/{cart_id}/items` - Add item to cart
- `DELETE /cart/{cart_id}/items/{product_id}` - Remove item from cart

#### Checkout
- `POST /checkout` - Complete order with optional discount code

#### Admin
- `GET /admin/statistics` - Get store statistics
- `POST /admin/generate-discount` - Manually check discount generation

## Usage Flow

1. **Browse Products**: View available products on the home page
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Click the cart button in the header
4. **Apply Discount**: Enter discount code if available
5. **Checkout**: Complete the order
6. **Admin Dashboard**: Click "Admin" to view statistics

## Discount Code Logic

- Discount codes are generated automatically after every 3rd order
- Each code provides 10% off the entire order
- Codes can only be used once
- Invalid or used codes will show an error message

## Development Notes

- Backend uses in-memory storage (data resets on restart)
- Frontend proxies API requests through Vite
- CORS is enabled for local development
- All monetary values are in USD

## Future Enhancements

- Persistent database (PostgreSQL/MongoDB)
- User authentication
- Order history
- Product search and filters
- Payment gateway integration
- Email notifications
- Inventory management

## License

MIT