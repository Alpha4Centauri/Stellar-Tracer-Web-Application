import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

function TrajectoryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [csvPath, setCsvPath] = useState<string | null>(null);
  const [period, setPeriod] = useState('');
  const [dt, setDt] = useState('');
  const [dtout, setDtout] = useState('');
  const [starIndex, setStarIndex] = useState('');
  const [plotUrl, setPlotUrl] = useState<string | null>(null);
  const [loadingSim, setLoadingSim] = useState(false);

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
    } catch (e) {
      console.error(e);
      alert('Error uploading file.');
    }
  };

  return (
    <div className="page">
      <h2>Trajectory Mapping</h2>

      <section className="card">
        <h3>Upload Cluster Dataset</h3>
        <input
          type="file"
          accept=".csv"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
        <button className="primary-button" onClick={handleUpload}>
          Upload
        </button>
      </section>

      {/* Add the rest of your UI here */}
    </div>
  );
}

export default TrajectoryPage;