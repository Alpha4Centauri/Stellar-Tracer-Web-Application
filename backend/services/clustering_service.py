import os
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.cluster import DBSCAN
from sklearn.neighbors import NearestNeighbors
from backend.services.preprocessing_service import default_preprocessing
from backend.utils.paths import cluster_csv_path, cluster_plot_path

def detect_clusters(csv_path: str):
    df = pd.read_csv(csv_path)

    cluster_candidates_filtered, scaled_features = default_preprocessing(df)

    feature_columns = ['pmra', 'pmdec', 'parallax']
    features = cluster_candidates_filtered[feature_columns].dropna()

    initial_k = 5
    nn = NearestNeighbors(n_neighbors=initial_k)
    nn.fit(scaled_features)
    distances, _ = nn.kneighbors(scaled_features)
    avg_k_distance = np.mean(distances[:, -1])
    estimated_eps = avg_k_distance

    nn_radius = NearestNeighbors(radius=estimated_eps)
    nn_radius.fit(scaled_features)
    neighbors_within_eps = nn_radius.radius_neighbors(scaled_features, return_distance=False)
    estimated_minPts = int(np.mean([len(n) for n in neighbors_within_eps]))

    db = DBSCAN(eps=estimated_eps, min_samples=estimated_minPts)
    labels = db.fit_predict(scaled_features)

    cluster_candidates_filtered = cluster_candidates_filtered.loc[features.index].copy()
    cluster_candidates_filtered['cluster'] = labels

    filtered_clusters = cluster_candidates_filtered[cluster_candidates_filtered['cluster'] != -1]

    clusters_meta = []

    unique_clusters = sorted(filtered_clusters['cluster'].unique())

    for cluster_id in unique_clusters:
        cluster_data = filtered_clusters[filtered_clusters['cluster'] == cluster_id]

        csv_out = cluster_csv_path(str(cluster_id))
        cluster_data.to_csv(csv_out, index=False)

        plot_out = cluster_plot_path(str(cluster_id))

        fig, axes = plt.subplots(1, 2, figsize=(12, 5))

        sns.scatterplot(data=cluster_data, x='ra', y='dec', ax=axes[0],
                        hue='cluster', palette='tab10', s=20, legend=False)
        axes[0].set_title(f"Cluster {cluster_id}: RA vs Dec")
        axes[0].set_xlabel("RA (deg)")
        axes[0].set_ylabel("Dec (deg)")
        axes[0].grid(True)

        sns.scatterplot(data=cluster_data, x='pmra', y='pmdec', ax=axes[1],
                        hue='cluster', palette='tab10', s=20, legend=False)
        axes[1].set_title(f"Cluster {cluster_id}: pmra vs pmdec")
        axes[1].set_xlabel("pmra (mas/yr)")
        axes[1].set_ylabel("pmdec (mas/yr)")
        axes[1].grid(True)

        plt.tight_layout()
        plt.savefig(plot_out)
        plt.close()

        clusters_meta.append({
            "cluster_id": str(cluster_id),
            "cluster_csv": csv_out,
            "plot_path": plot_out,
        })

    return clusters_meta
