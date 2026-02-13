from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import (
    sky_query_router,
    filters_router,
    clusters_router,
    stars_router,
    trajectory_router,
    jobs_router
)

app = FastAPI(title="Stellar Tracer Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sky_query_router.router)
app.include_router(filters_router.router)
app.include_router(clusters_router.router)
app.include_router(stars_router.router)
app.include_router(trajectory_router.router)
app.include_router(jobs_router.router)