from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers import product_controller, cart_controller, checkout_controller, admin_controller

app = FastAPI(title="Ecommerce Store API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_controller.router)
app.include_router(cart_controller.router)
app.include_router(checkout_controller.router)
app.include_router(admin_controller.router)

@app.get("/")
def read_root():
    return {"message": "Ecommerce Store API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)