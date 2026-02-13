from fastapi import APIRouter, Form, HTTPException
import os
from backend.services.star_service import get_star_properties

router = APIRouter(prefix="/api", tags=["stars"])

@router.post("/star-properties")
async def api_star_properties(csv_path: str = Form(...), star_index: int = Form(...)):
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="File not found")
    try:
        props = get_star_properties(csv_path, star_index)
        return props
    except IndexError:
        raise HTTPException(status_code=400, detail="Star index out of range")
