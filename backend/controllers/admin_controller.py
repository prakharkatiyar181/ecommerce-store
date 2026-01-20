from fastapi import APIRouter
from services.business_logic import AdminService

# Admin endpoints - statistics and discount management
router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/generate-discount")
async def generate_discount_code():
    return await AdminService.generate_discount_code()

@router.get("/statistics")
async def get_statistics():
    return await AdminService.get_statistics()
