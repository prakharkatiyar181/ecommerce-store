from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from controllers import product_controller, cart_controller, checkout_controller, admin_controller
import time

app = FastAPI(
    title="Ecommerce Store API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# GZip compression - 60-70% smaller responses
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS - allow frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Performance timing - adds X-Process-Time header (in ms)
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time * 1000, 2))
    return response

app.include_router(product_controller.router)
app.include_router(cart_controller.router)
app.include_router(checkout_controller.router)
app.include_router(admin_controller.router)

@app.get("/")
async def read_root():
    return {"message": "Ecommerce Store API", "version": "1.0.0", "status": "running"}

# Health check for load balancers
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": time.time()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        access_log=True
    )