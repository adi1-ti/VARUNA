// VARUNA Maritime Intelligence — Met-Ocean Environmental & Drift Simulation Data
// Integrates GFS (Global Forecast System) atmospheric wind & HYCOM ocean surface currents.

export const ENVIRONMENTAL_DATA = {
  "VR-2026-001": {
    incidentId: "VR-2026-001",
    atmosphereModel: "NOAA GFS (Global Forecast System 0.25°)",
    oceanModel: "HYCOM + NCODA Global 1/12° Reanalysis",
    observationEpoch: "2026-11-15T04:22:00Z",
    windSpeedKnots: 14.2,
    windDirectionDeg: 285, // Coming from WNW blowing towards ESE
    windFactorLeewayPercent: 3.1, // Oil leeway drift factor (standard 3-3.5%)
    oceanCurrentSpeedMs: 0.65,
    oceanCurrentDirectionDeg: 135, // Flowing towards SE
    seaSurfaceTempC: 28.4,
    significantWaveHeightM: 1.8,
    seaState: "Douglas Sea State 4 (Moderate Sea)",
    driftModel: "OpenDrift / OpenOil Lagrangian Particle Dispersion (Simulated)",
    particleCount: 5000,
    backwardStepsCount: 7,
    backwardStepIntervalMinutes: 60,
    totalDriftHours: 6.5,
    reconstructedOrigin: {
      lat: 19.3412,
      lon: 66.3218,
      uncertaintyRadiusKm: 3.2,
      confidenceScore: 89,
      estimatedTimeWindow: "2026-11-14 20:30 UTC — 23:45 UTC",
      centroidSpeed: "1.42 knots net drift velocity"
    },
    // Trajectory waypoints from Detection (T=0) backwards to Probable Origin (T = -6.5 hrs)
    trajectoryWaypoints: [
      {
        step: 0,
        time: "2026-11-15 04:22 UTC (T=0)",
        label: "Observed Slick Centroid (Sentinel-1)",
        lat: 19.2045,
        lon: 66.5124,
        dispersionRadiusKm: 4.8,
        driftRateKnots: 1.45,
        isObservation: true
      },
      {
        step: 1,
        time: "2026-11-15 03:22 UTC (T -1h)",
        label: "Backward Step 1",
        lat: 19.2255,
        lon: 66.4820,
        dispersionRadiusKm: 4.4,
        driftRateKnots: 1.43
      },
      {
        step: 2,
        time: "2026-11-15 02:22 UTC (T -2h)",
        label: "Backward Step 2",
        lat: 19.2468,
        lon: 66.4518,
        dispersionRadiusKm: 4.0,
        driftRateKnots: 1.40
      },
      {
        step: 3,
        time: "2026-11-15 01:22 UTC (T -3h)",
        label: "Backward Step 3",
        lat: 19.2701,
        lon: 66.4210,
        dispersionRadiusKm: 3.7,
        driftRateKnots: 1.42
      },
      {
        step: 4,
        time: "2026-11-15 00:22 UTC (T -4h)",
        label: "Backward Step 4",
        lat: 19.2934,
        lon: 66.3882,
        dispersionRadiusKm: 3.5,
        driftRateKnots: 1.44
      },
      {
        step: 5,
        time: "2026-11-14 23:22 UTC (T -5h)",
        label: "Backward Step 5 (Entering Origin Window)",
        lat: 19.3175,
        lon: 66.3551,
        dispersionRadiusKm: 3.3,
        driftRateKnots: 1.41
      },
      {
        step: 6,
        time: "2026-11-14 22:22 UTC (T -6h)",
        label: "Estimated Release Event Centroid",
        lat: 19.3412,
        lon: 66.3218,
        dispersionRadiusKm: 3.2,
        driftRateKnots: 1.39,
        isOrigin: true
      },
      {
        step: 7,
        time: "2026-11-14 21:52 UTC (T -6.5h)",
        label: "Initial Discharge Inception Boundary",
        lat: 19.3524,
        lon: 66.3050,
        dispersionRadiusKm: 3.1,
        driftRateKnots: 1.38,
        isOriginBoundary: true
      }
    ]
  },
  "VR-2026-002": {
    incidentId: "VR-2026-002",
    atmosphereModel: "NOAA GFS 0.25°",
    oceanModel: "INCOIS Regional Coastal Model",
    observationEpoch: "2026-11-17T01:14:00Z",
    windSpeedKnots: 11.8,
    windDirectionDeg: 230,
    windFactorLeewayPercent: 3.0,
    oceanCurrentSpeedMs: 1.12,
    oceanCurrentDirectionDeg: 45,
    seaSurfaceTempC: 27.2,
    significantWaveHeightM: 1.2,
    seaState: "Douglas Sea State 3 (Slight-Moderate)",
    driftModel: "OpenDrift / OpenOil (Simulated)",
    particleCount: 5000,
    backwardStepsCount: 5,
    backwardStepIntervalMinutes: 60,
    totalDriftHours: 4.8,
    reconstructedOrigin: {
      lat: 22.2891,
      lon: 68.9812,
      uncertaintyRadiusKm: 2.1,
      confidenceScore: 93,
      estimatedTimeWindow: "2026-11-16 19:00 UTC — 21:30 UTC",
      centroidSpeed: "2.1 knots net drift velocity"
    },
    trajectoryWaypoints: [
      { step: 0, time: "2026-11-17 01:14 UTC", label: "Observed Slick", lat: 22.4182, lon: 69.1124, isObservation: true },
      { step: 1, time: "2026-11-17 00:14 UTC", label: "Step 1", lat: 22.3850, lon: 69.0790 },
      { step: 2, time: "2026-11-16 23:14 UTC", label: "Step 2", lat: 22.3520, lon: 69.0460 },
      { step: 3, time: "2026-11-16 22:14 UTC", label: "Step 3", lat: 22.3200, lon: 69.0130 },
      { step: 4, time: "2026-11-16 21:14 UTC", label: "Probable Origin", lat: 22.2891, lon: 68.9812, isOrigin: true }
    ]
  }
};

export const getEnvironmentalData = (incidentId) => {
  return ENVIRONMENTAL_DATA[incidentId] || ENVIRONMENTAL_DATA["VR-2026-001"];
};
