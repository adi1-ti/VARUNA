import React, { createContext, useContext, useState } from 'react';
import { INCIDENTS } from '../data/incidents';
import { getSatelliteScene } from '../data/satelliteData';
import { getEnvironmentalData } from '../data/environmentalData';
import { getVesselsForIncident } from '../data/vesselData';

const IncidentContext = createContext();

export function IncidentProvider({ children }) {
  const [selectedIncidentId, setSelectedIncidentId] = useState("VR-2026-001");
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState("dashboard");

  const currentIncident = INCIDENTS.find(inc => inc.id === selectedIncidentId) || INCIDENTS[0];
  const satelliteScene = getSatelliteScene(currentIncident.id);
  const environmentalData = getEnvironmentalData(currentIncident.id);
  const vessels = getVesselsForIncident(currentIncident.id);

  const value = {
    incidents: INCIDENTS,
    currentIncident,
    selectedIncidentId,
    setSelectedIncidentId,
    satelliteScene,
    environmentalData,
    vessels,
    simulationSpeed,
    setSimulationSpeed,
    activeTab,
    setActiveTab
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncident() {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error("useIncident must be used within an IncidentProvider");
  }
  return context;
}
