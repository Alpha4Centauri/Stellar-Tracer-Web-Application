from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import os
from fastapi.responses import FileResponse
from backend.utils.paths import new_data_path
from backend.services.clustering_service import detect_clusters

router = APIRouter(prefix="/api", tags=["clusters"])

@router.post("/upload-cluster")
async def api_upload_cluster(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be CSV")
    path = new_data_path(".csv")
    with open(path, "wb") as f:
        f.write(await file.read())
    return {"csv_path": path}

@router.post("/detect-clusters")
async def api_detect_clusters(csv_path: str = Form(...)):
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="File not found")
    clusters = detect_clusters(csv_path)
    return {"clusters": clusters}

@router.post("/download-plot")
async def api_download_plot(plot_path: str = Form(...)):
    if not os.path.exists(plot_path):
        raise HTTPException(status_code=404, detail="Plot not found")
    return FileResponse(plot_path, filename=os.path.basename(plot_path), media_type="image/png")
