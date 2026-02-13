import os
import uuid
from backend.config import (
    DATA_DIR,
    CLUSTER_CSV_DIR,
    CLUSTER_PLOTS_DIR,
    TRAJECTORY_PLOTS_DIR
)

def new_data_path(suffix=".csv"):
    return os.path.join(DATA_DIR, f"{uuid.uuid4()}{suffix}")

def new_trajectory_plot_path(prefix="trajectory_", suffix=".png"):
    return os.path.join(TRAJECTORY_PLOTS_DIR, f"{prefix}{uuid.uuid4()}{suffix}")

def cluster_csv_path(cluster_id: str):
    return os.path.join(CLUSTER_CSV_DIR, f"cluster_{cluster_id}.csv")

def cluster_plot_path(cluster_id: str):
    return os.path.join(CLUSTER_PLOTS_DIR, f"cluster_{cluster_id}.png")