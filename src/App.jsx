import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { IncidentProvider } from './context/IncidentContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

import Dashboard from './pages/Dashboard';
import SatelliteDetection from './pages/SatelliteDetection';
import OriginReconstruction from './pages/OriginReconstruction';
import VesselAttribution from './pages/VesselAttribution';
import IntelligenceMap from './pages/IntelligenceMap';
import Analytics from './pages/Analytics';

function AppLayout() {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/satellite':
        return 'Satellite SAR Detection';
      case '/origin':
        return 'Hydrodynamic Origin Reconstruction';
      case '/vessels':
        return 'Vessel Attribution & Anomaly Analysis';
      case '/map':
        return 'GIS Operational Intelligence Map';
      case '/analytics':
        return 'Forensic Analytics & Evidentiary Dossier';
      case '/':
      default:
        return 'Maritime Command Center';
    }
  };

  return (
    <div className="app-container">
      {/* Fixed Command Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="main-wrapper">
        {/* Top Simulation Protocol Notice */}
        <div className="simulation-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="pulse-dot pulse-dot-amber" />
            <span>VARUNA DEFENCE & CIVIL SURVEILLANCE · SIMULATION ENVIRONMENT</span>
          </div>
          <span className="badge">DEMONSTRATION DATASET</span>
        </div>

        {/* Global Context Topbar */}
        <Topbar pageTitle={getPageTitle(location.pathname)} />

        {/* Page Content Viewport */}
        <main className="content-viewport">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/satellite" element={<SatelliteDetection />} />
            <Route path="/origin" element={<OriginReconstruction />} />
            <Route path="/vessels" element={<VesselAttribution />} />
            <Route path="/map" element={<IntelligenceMap />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <IncidentProvider>
        <AppLayout />
      </IncidentProvider>
    </BrowserRouter>
  );
}
