import React, { useState } from 'react';
import { IncidentProvider } from './context/IncidentContext';
import TacticalTopBar from './components/TacticalTopBar';
import AnalyticsControls from './components/AnalyticsControls';
import VesselDetailsDrawer from './components/VesselDetailsDrawer';
import GeointMap from './components/GeointMap';
import ReportModal from './components/ReportModal';

function GeointPlatformWorkspace() {
  // Operational View Mode: 'tactical' (reference image), 'sar' (SAR mask), 'drift' (drift simulation)
  const [currentMode, setCurrentMode] = useState('tactical');

  // Left Controls Panel State
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [filters, setFilters] = useState({
    confidenceThreshold: 0.85,
    showBoundingBoxes: true,
    showTrajectories: true,
    detectionModel: 'MULTI-MODAL OPTICAL/SAR',
    matchedAisVessels: true,
    unmatchedVessels: true,
    rfSignalCorrelation: true,
    timeWindowHours: 24,
    satelliteOptical: true,
    syntheticRadar: true,
    automaticIdentification: true,
  });

  // Right Details Drawer State
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState({
    label: "UNMATCHED TARGET #42",
    mmsi: "N/A (AIS NOT BROADCASTING)",
    imo: "UNKNOWN",
    callSign: "N/A",
    flag: "UNKNOWN",
    status: "UNMATCHED / DARK VESSEL",
    source: "OPTICAL & SAR FUSION",
    confidence: "92%",
    length: "185m",
    width: "28m",
    tonnage: "35,000 GT",
    classifiedType: "TANKER / BULK CARRIER",
    lastDetected: "2026-02-09 14:35:22 UTC",
    firstDetected: "2026-02-08 23:10:45 UTC",
    speed: "12.5 KNOTS",
    heading: "210° (SSW)",
    lastAisPos: "N/A",
    notes: "VESSEL OPERATING WITHOUT AIS IN RESTRICTED ZONE. RF SIGNALS DETECTED IN VICINITY CORRELATE WITH VESSEL POSITION. UNUSUAL LOITERING PATTERN OBSERVED.",
  });

  // Evidentiary Dossier Modal State
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <div className="geoint-workspace">
      {/* 1. Tactical Command Header */}
      <TacticalTopBar
        currentMode={currentMode}
        setCurrentMode={setCurrentMode}
        onOpenReportModal={() => setIsReportOpen(true)}
      />

      {/* 2. Main Full-Screen Geospatial Intelligence Center */}
      <div className="geoint-map-area">
        {/* Full-bleed Satellite Map with Concentric Envelopes & AIS Overlays */}
        <GeointMap
          filters={filters}
          currentMode={currentMode}
          onSelectTarget={(target) => {
            setSelectedTarget(target);
            setIsDetailsOpen(true);
          }}
          selectedTarget={selectedTarget}
        />

        {/* Left-side Analytics Controls Drawer (Dock + Floating Panel) */}
        <AnalyticsControls
          filters={filters}
          setFilters={setFilters}
          isOpen={isControlsOpen}
          setIsOpen={setIsControlsOpen}
        />

        {/* Right-side Target Intelligence Drawer matching Reference Image */}
        <VesselDetailsDrawer
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          selectedTarget={selectedTarget}
          onSelectTarget={setSelectedTarget}
          onOpenReport={() => setIsReportOpen(true)}
        />
      </div>

      {/* 3. Formal Evidentiary Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        target={selectedTarget}
      />
    </div>
  );
}

export default function App() {
  return (
    <IncidentProvider>
      <GeointPlatformWorkspace />
    </IncidentProvider>
  );
}
