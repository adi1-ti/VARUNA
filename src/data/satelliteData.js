// VARUNA Maritime Intelligence — Satellite SAR Scene Registry & Segmentation Masks
// Synthetic Aperture Radar (SAR) simulates Sentinel-1 C-band level-1 GRD imagery.

export const SATELLITE_SCENES = {
  "VR-2026-001": {
    incidentId: "VR-2026-001",
    mission: "Copernicus Sentinel-1B",
    instrument: "C-SAR (C-Band Synthetic Aperture Radar)",
    acquisitionTime: "2026-11-15T04:21:58.214Z",
    passDirection: "Descending (Orbit 142)",
    polarization: "VV (Co-polarization) + VH (Cross-polarization)",
    swathMode: "IW (Interferometric Wide Swath)",
    incidenceAngleRange: "31.2° — 46.1°",
    spatialResolution: "10m × 10m Ground Sample Distance",
    sceneCenter: [19.2045, 66.5124],
    spillPolygon: [
      [19.2450, 66.4700],
      [19.2610, 66.4950],
      [19.2550, 66.5400],
      [19.2150, 66.5650],
      [19.1820, 66.5350],
      [19.1750, 66.4900],
      [19.1980, 66.4650]
    ],
    spillAreaKm2: 12.8,
    estimatedLengthKm: 14.2,
    meanWidthKm: 0.9,
    backscatterDampingRatioDb: 7.8, // dB drop in backscatter due to Bragg wave damping
    detectionConfidence: 94,
    aiModel: "VARUNA Deep-SAR U-Net v3.2 (Dual-Pol Semantic Segmenter)",
    inferenceTimeMs: 248,
    falsePositiveRejection: "Low-wind look-alike rejected via GFS 14.2 kn wind verification",
    lookAlikeProbability: 0.04,
    features: {
      highContrastEdge: "Sharp boundary matching slick tail",
      feathering: "Downwind dispersion tail observed at south-east flank",
      internalEmulsification: "Thick oil patches detected in western core"
    }
  },
  "VR-2026-002": {
    incidentId: "VR-2026-002",
    mission: "Copernicus Sentinel-1A",
    instrument: "C-SAR",
    acquisitionTime: "2026-11-17T01:14:02.100Z",
    passDirection: "Ascending",
    polarization: "VV + VH",
    swathMode: "IW",
    incidenceAngleRange: "34.0° — 42.5°",
    spatialResolution: "10m",
    sceneCenter: [22.4182, 69.1124],
    spillPolygon: [
      [22.4500, 69.0700],
      [22.4600, 69.1300],
      [22.4100, 69.1550],
      [22.3800, 69.0900]
    ],
    spillAreaKm2: 18.4,
    estimatedLengthKm: 21.0,
    meanWidthKm: 1.1,
    backscatterDampingRatioDb: 9.2,
    detectionConfidence: 96,
    aiModel: "VARUNA Deep-SAR U-Net v3.2",
    inferenceTimeMs: 290,
    falsePositiveRejection: "High confidence persistent slick",
    lookAlikeProbability: 0.02
  }
};

export const getSatelliteScene = (incidentId) => {
  return SATELLITE_SCENES[incidentId] || SATELLITE_SCENES["VR-2026-001"];
};
