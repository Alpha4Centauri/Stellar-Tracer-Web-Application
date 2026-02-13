import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_DIR = os.path.join(BASE_DIR, "data")
TRAJECTORY_PLOTS_DIR = os.path.join(BASE_DIR, "trajectory_plots")
CLUSTER_CSV_DIR = os.path.join(BASE_DIR, "cluster_csvs")
CLUSTER_PLOTS_DIR = os.path.join(BASE_DIR, "cluster_plots")

for d in [DATA_DIR, CLUSTER_CSV_DIR, CLUSTER_PLOTS_DIR, TRAJECTORY_PLOTS_DIR]:
    os.makedirs(d, exist_ok=True)