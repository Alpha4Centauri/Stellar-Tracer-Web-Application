import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

interface ClusterMeta {
  cluster_id: string;
  plot_path: string;
  cluster_csv: string;
}

function StarClustersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [csvPath, setCsvPath] = useState<string | null>(null);
  const [clusters, setClusters] = useState<ClusterMeta[]>([]);
  const [loadingClusters, setLoadingClusters] = useState(false);
  const [starIndex, setStarIndex] = useState('');
  const [selectedClusterCsv, setSelectedClusterCsv] = useState<string | null>(null);
  const [starProps, setStarProps] = useState<Record<string, any> | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a CSV file.');
      return;
    }
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await axios.post(`${API_BASE}/upload-cluster`, form);
      setCsvPath(res.data.csv_path);
      alert('File uploaded successfully.');
    } catch {
      alert('Error uploading file.');
    }
  };

  const handleDetectClusters = async () => {
    if (!csvPath) {
      alert('Upload a cluster CSV first.');
      return;
    }
    setLoadingClusters(true);
    try {
      const form = new FormData();
      form.append('csv_path', csvPath);
      const res = await axios.post(`${API_BASE}/detect-clusters`, form);
      setClusters(res.data.clusters);
    } catch {
      alert('Error detecting clusters.');
    } finally {
      setLoadingClusters(false);
    }
  };

  const handleDownloadPlot = async (plotPath: string) => {
    const form = new FormData();
    form.append('plot_path', plotPath);
    const res = await axios.post(`${API_BASE}/download-plot`, form, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cluster_plot.png');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleViewStarProps = async () => {
    if (!selectedClusterCsv) {
      alert('Select a cluster first.');
      return;
    }
    const idx = parseInt(starIndex, 10);
    if (isNaN(idx)) {
      alert('Star index must be an integer.');
      return;
    }
    try {
      const form = new FormData();
      form.append('csv_path', selectedClusterCsv);
      form.append('star_index', String(idx));
      const res = await axios.post(`${API_BASE}/star-properties`, form);
      setStarProps(res.data);
    } catch {
      alert('Error fetching star properties.');
    }
  };

  return (
    <div className="page">
      <h2>Star Clusters</h2>

      <section className="card">
        <h3>Upload Cluster Dataset</h3>
        <input type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button className="primary-button" onClick={handleUpload}>Upload</button>
      </section>

      <section className="card">
        <h3>Detect Clusters</h3>
        <button className="primary-button" onClick={handleDetectClusters} disabled={loadingClusters}>
          {loadingClusters ? 'Detecting…' : 'Detect Clusters'}
        </button>
      </section>

      {clusters.length > 0 && (
        <section className="card">
          <h3>Detected Clusters</h3>
          <ul className="cluster-list">
            {clusters.map(c => (
              <li key={c.cluster_id} className="cluster-item">
                <strong>Cluster {c.cluster_id}</strong>
                <div>
                  <button onClick={() => handleDownloadPlot(c.plot_path)}>Download Plot</button>
                  <button onClick={() => setSelectedClusterCsv(c.cluster_csv)}>Select</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card">
        <h3>View Star Properties</h3>
        <input
          className="text-input"
          placeholder="Star index"
          value={starIndex}
          onChange={e => setStarIndex(e.target.value)}
        />
        <button className="primary-button" onClick={handleViewStarProps}>View Properties</button>
      </section>

      {starProps && (
        <div className="modal">
          <div className="modal-content">
            <h4>Star Properties</h4>
            <pre>{JSON.stringify(starProps, null, 2)}</pre>
            <button onClick={() => setStarProps(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StarClustersPage;