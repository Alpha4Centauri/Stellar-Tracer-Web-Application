import { Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StarClustersPage from './pages/StarClustersPage';
import TrajectoryPage from './pages/TrajectoryPage';
import './App.css';

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Stellar Tracer</h1>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/clusters">Star Clusters</NavLink>
          <NavLink to="/trajectory">Trajectory Mapping</NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clusters" element={<StarClustersPage />} />
          <Route path="/trajectory" element={<TrajectoryPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;