from fastapi import APIRouter, Form, HTTPException
from typing import Optional
import os
from fastapi.responses import FileResponse
from backend.services.preprocessing_service import apply_custom_filters

router = APIRouter(prefix="/api", tags=["filters"])

@router.post("/apply-filters")
async def api_apply_filters(csv_path: str = Form(...), filters: Optional[str] = Form(None)):
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="File not found")
    try:
        filtered_path = apply_custom_filters(csv_path, filters)
        return {"filtered_csv_path": filtered_path}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/download-csv")
async def api_download_csv(csv_path: str = Form(...)):
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(csv_path, filename="gaia_dataset.csv", media_type="text/csv")
