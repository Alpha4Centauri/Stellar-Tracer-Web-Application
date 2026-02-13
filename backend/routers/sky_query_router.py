from fastapi import APIRouter, Form, HTTPException
from backend.services.sky_query_service import run_sky_query

router = APIRouter(prefix="/api", tags=["sky-query"])

@router.post("/sky-query")
async def api_sky_query(query: str = Form(...)):
    try:
        csv_path = run_sky_query(query)
        return {"csv_path": csv_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))