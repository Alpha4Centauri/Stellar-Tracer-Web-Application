import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

function HomePage() {
  const [query, setQuery] = useState('');
  const [csvPath, setCsvPath] = useState<string | null>(null);
  const [filters, setFilters] = useState('');
  const [filteredCsvPath, setFilteredCsvPath] = useState<string | null>(null);
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showFilteredDownloadModal, setShowFilteredDownloadModal] = useState(false);

  const handleSkyLookup = async () => {
    if (!query.trim()) {
      alert('Enter an ADQL query.');
      return;
    }
    setLoadingQuery(true);
    try {
      const form = new FormData();
      form.append('query', query);
      const res = await axios.post(`${API_BASE}/sky-query`, form);
      setCsvPath(res.data.csv_path);
      setShowDownloadModal(true);
    } catch {
      alert('Error running sky query');
    } finally {
      setLoadingQuery(false);
    }
  };

  const handleDownloadCsv = async (path: string | null, filename: string) => {
    if (!path) return;
    const form = new FormData();
    form.append('csv_path', path);
    const res = await axios.post(`${API_BASE}/download-csv`, form, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleApplyFilters = async () => {
    if (!csvPath) {
      alert('Run a sky query first.');
      return;
    }
    setLoadingFilters(true);
    try {
      const form = new FormData();
      form.append('csv_path', csvPath);
      form.append('filters', filters);
      const res = await axios.post(`${API_BASE}/apply-filters`, form);
      setFilteredCsvPath(res.data.filtered_csv_path);
      setShowFilteredDownloadModal(true);
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Error applying filters');
    } finally {
      setLoadingFilters(false);
    }
  };

  return (
    <div className="page">
      <h2>Home</h2>

      <section className="card">
        <h3>Sky Query</h3>
        <textarea
          className="text-input"
          placeholder="SELECT * FROM gaiadr3.gaia_source WHERE ..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          rows={6}
        />
        <button className="primary-button" onClick={handleSkyLookup} disabled={loadingQuery}>
          {loadingQuery ? 'Looking up…' : 'Lookup'}
        </button>
      </section>

      <section className="card">
        <h3>Custom Filters</h3>
        <textarea
          className="text-input"
          placeholder="ruwe < 1.4"
          value={filters}
          onChange={e => setFilters(e.target.value)}
          rows={3}
        />
        <button className="primary-button" onClick={handleApplyFilters} disabled={loadingFilters}>
          {loadingFilters ? 'Applying…' : 'Apply Filters'}
        </button>
      </section>

      {showDownloadModal && csvPath && (
        <div className="modal">
          <div className="modal-content">
            <h4>Dataset Ready</h4>
            <button onClick={() => handleDownloadCsv(csvPath, 'gaia_dataset.csv')}>
              Download
            </button>
            <button onClick={() => setShowDownloadModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showFilteredDownloadModal && filteredCsvPath && (
        <div className="modal">
          <div className="modal-content">
            <h4>Filtered Dataset Ready</h4>
            <button onClick={() => handleDownloadCsv(filteredCsvPath, 'filtered_dataset.csv')}>
              Download
            </button>
            <button onClick={() => setShowFilteredDownloadModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;