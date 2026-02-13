from fastapi import APIRouter, HTTPException
from backend.jobs.job_manager import get_job

router = APIRouter(prefix="/api", tags=["jobs"])

@router.get("/job/{job_id}")
async def api_job_status(job_id: str):
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
