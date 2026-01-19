from fastapi import APIRouter
from services.business_logic import AdminService

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/generate-discount")
def generate_discount_code():
    return AdminService.generate_discount_code()

@router.get("/statistics")
def get_statistics():
    return AdminService.get_statistics()
