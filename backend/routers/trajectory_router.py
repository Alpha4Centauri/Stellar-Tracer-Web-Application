from fastapi import APIRouter, Form, HTTPException
import os
from fastapi.responses import FileResponse
from backend.services.trajectory_service import simulate_trajectory

router = APIRouter(prefix="/api", tags=["trajectory"])

@router.post("/simulate-trajectory")
async def api_simulate_trajectory(
    csv_path: str = Form(...),
    period: float = Form(...),
    dt: float = Form(...),
    dtout: float = Form(...),
    star_index: int = Form(...)
):
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="File not found")
    try:
        plot_path = simulate_trajectory(csv_path, period, dt, dtout, star_index)
        return {"plot_path": plot_path}
    except IndexError:
        raise HTTPException(status_code=400, detail="Star index out of range")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
