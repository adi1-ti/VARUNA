// VARUNA Maritime Intelligence — Candidate Vessel Registry & AIS Tracking Records
// Fictional demonstration records for simulation and attribution evaluation.

export const VESSEL_CANDIDATES = {
  "VR-2026-001": [
    {
      id: "IMO-9387421",
      name: "MV Ocean Pioneer",
      flag: "Liberia (LR)",
      callSign: "A8KL9",
      type: "Crude Oil Tanker",
      length: 274, // meters
      beam: 48,
      dwt: 158000,
      yearBuilt: 2012,
      destination: "Singapore (SGSIN)",
      eta: "2026-11-22 18:00 UTC",
      speedAtWindow: "6.2 kn (Drop from 14.1 kn)",
      heading: "112° (ESE)",
      distanceToOrigin: 2.4, // km
      proximityScore: 92, // P (0-100)
      temporalOverlap: "High (Exact Match)",
      temporalScore: 95, // T (0-100)
      aisStatus: "Signal Gap Detected (3.2 hrs)",
      aisScore: 90, // A (0-100)
      vesselRiskFactor: 95, // R (0-100) Tanker carrying crude/slop
      suspicionScore: 87, // Computed: 0.4*92 + 0.3*95 + 0.2*90 + 0.1*95 = 36.8 + 28.5 + 18.0 + 9.5 = 92.8 -> normalized 87
      confidenceRating: "HIGH CONFIDENCE ATTRIBUTION",
      status: "PRIMARY SUSPECT",
      aisTrajectory: [
        { lat: 19.520, lon: 65.850, time: "2026-11-14 18:00", speed: 14.4, status: "AIS Normal" },
        { lat: 19.435, lon: 66.080, time: "2026-11-14 19:45", speed: 14.1, status: "AIS Normal" },
        { lat: 19.380, lon: 66.210, time: "2026-11-14 20:30", speed: 13.8, status: "AIS Signal Lost (Gap Start)" },
        { lat: 19.345, lon: 66.315, time: "2026-11-14 21:45", speed: 6.2, status: "Reconstructed Position (Drift/Discharge)", simulated: true },
        { lat: 19.300, lon: 66.440, time: "2026-11-14 23:45", speed: 11.2, status: "AIS Signal Restored (Gap End)" },
        { lat: 19.180, lon: 66.750, time: "2026-11-15 03:00", speed: 14.0, status: "AIS Normal" },
        { lat: 19.050, lon: 67.120, time: "2026-11-15 06:00", speed: 14.2, status: "En Route" }
      ],
      anomalyRationale: [
        "Transponder disabled for 3 hours 15 minutes while transiting within 2.4 km of backward-reconstructed oil spill origin.",
        "Speed dropped abruptly from cruise 14.1 knots to 6.2 knots during the silent window, consistent with slow-speed oily bilge tank de-ballasting.",
        "Draft variation reported at prior port inspection indicates unrecorded cargo slop tank volume reduction.",
        "Re-transmission of AIS occurred only after leaving the immediate spill centroid quadrant."
      ]
    },
    {
      id: "IMO-9452011",
      name: "MT Pacific Zenith",
      flag: "Panama (PA)",
      callSign: "3EYZ8",
      type: "Chemical / Products Carrier",
      length: 183,
      beam: 32,
      dwt: 49999,
      yearBuilt: 2017,
      destination: "Fujairah (AEFUJ)",
      eta: "2026-11-18 04:00 UTC",
      speedAtWindow: "13.4 kn",
      heading: "295° (WNW)",
      distanceToOrigin: 11.8, // km
      proximityScore: 68,
      temporalOverlap: "Moderate (Border Window)",
      temporalScore: 70,
      aisStatus: "Continuous Transmission",
      aisScore: 35,
      vesselRiskFactor: 85,
      suspicionScore: 62, // 0.4*68 + 0.3*70 + 0.2*35 + 0.1*85 = 27.2 + 21.0 + 7.0 + 8.5 = 63.7 -> 62
      confidenceRating: "SECONDARY CANDIDATE",
      status: "UNDER REVIEW",
      aisTrajectory: [
        { lat: 19.150, lon: 66.850, time: "2026-11-14 19:00", speed: 13.5, status: "AIS Normal" },
        { lat: 19.240, lon: 66.580, time: "2026-11-14 21:00", speed: 13.4, status: "AIS Normal" },
        { lat: 19.310, lon: 66.390, time: "2026-11-14 22:30", speed: 13.4, status: "Nearest Point of Approach" },
        { lat: 19.420, lon: 66.120, time: "2026-11-15 00:30", speed: 13.5, status: "AIS Normal" },
        { lat: 19.550, lon: 65.800, time: "2026-11-15 03:00", speed: 13.3, status: "AIS Normal" }
      ],
      anomalyRationale: [
        "Vessel maintained standard navigational speed (13.4 kn) and constant course along deep-sea transit lane.",
        "Passed approximately 11.8 km north of the origin centroid, outside the primary drift dispersion envelope.",
        "No AIS gaps or transmitter telemetry dropouts recorded."
      ]
    },
    {
      id: "IMO-9238914",
      name: "MV Nordic Trader",
      flag: "Marshall Islands (MH)",
      callSign: "V7DJ4",
      type: "Capesize Bulk Carrier",
      length: 292,
      beam: 45,
      dwt: 178000,
      yearBuilt: 2008,
      destination: "Jawaharlal Nehru Port (INNSA)",
      eta: "2026-11-16 10:00 UTC",
      speedAtWindow: "11.8 kn",
      heading: "078° (ENE)",
      distanceToOrigin: 28.5, // km
      proximityScore: 38,
      temporalOverlap: "Low (Out of Primary Window)",
      temporalScore: 40,
      aisStatus: "Continuous Transmission",
      aisScore: 20,
      vesselRiskFactor: 50, // Dry bulk, heavy fuel oil bilge risk lower than crude tanker
      suspicionScore: 36, // 0.4*38 + 0.3*40 + 0.2*20 + 0.1*50 = 15.2 + 12.0 + 4.0 + 5.0 = 36.2 -> 36
      confidenceRating: "LOW SUSPICION",
      status: "CLEARED / LOW PRIORITY",
      aisTrajectory: [
        { lat: 18.980, lon: 65.950, time: "2026-11-14 18:00", speed: 11.9, status: "AIS Normal" },
        { lat: 19.050, lon: 66.250, time: "2026-11-14 20:30", speed: 11.8, status: "AIS Normal" },
        { lat: 19.120, lon: 66.580, time: "2026-11-14 23:00", speed: 11.8, status: "AIS Normal" },
        { lat: 19.180, lon: 66.900, time: "2026-11-15 01:30", speed: 11.7, status: "AIS Normal" }
      ],
      anomalyRationale: [
        "Lateral distance from origin exceeded 28 km at all points in the temporal envelope.",
        "Constant track heading and speed; zero recorded sensor or navigation discrepancies."
      ]
    },
    {
      id: "MMSI-4198201",
      name: "FV Sagar Kanya 14",
      flag: "India (IN)",
      callSign: "AT3288",
      type: "Mechanised Deep-Sea Fishing Trawler",
      length: 28,
      beam: 7,
      dwt: 140,
      yearBuilt: 2019,
      destination: "Veraval Fishing Harbour (INVER)",
      eta: "2026-11-17 12:00 UTC",
      speedAtWindow: "3.8 kn (Trawling)",
      heading: "190° (S)",
      distanceToOrigin: 34.2, // km
      proximityScore: 22,
      temporalOverlap: "Moderate",
      temporalScore: 50,
      aisStatus: "Class-B Transponder (Intermittent Range)",
      aisScore: 30,
      vesselRiskFactor: 20, // Low fuel capacity, cannot generate 12.8 km² slick
      suspicionScore: 29, // 0.4*22 + 0.3*50 + 0.2*30 + 0.1*20 = 8.8 + 15.0 + 6.0 + 2.0 = 31.8 -> 29
      confidenceRating: "EXCLUDED (PHYSICAL CAPACITY)",
      status: "INSUFFICIENT CAPACITY",
      aisTrajectory: [
        { lat: 19.550, lon: 66.720, time: "2026-11-14 20:00", speed: 4.1, status: "Trawling" },
        { lat: 19.520, lon: 66.700, time: "2026-11-14 22:00", speed: 3.8, status: "Trawling" },
        { lat: 19.490, lon: 66.680, time: "2026-11-15 00:00", speed: 3.9, status: "Trawling" }
      ],
      anomalyRationale: [
        "Vessel fuel capacity is less than 35 kilolitres; physically incapable of producing an estimated 3,400 bbl slick.",
        "Operating 34 km northwest of origin area."
      ]
    }
  ],
  "VR-2026-002": [
    {
      id: "IMO-9145892",
      name: "MT Al-Nibras",
      flag: "Oman (OM)",
      callSign: "A4DB2",
      type: "Chemical / Products Tanker",
      length: 180,
      beam: 30,
      dwt: 45000,
      yearBuilt: 2015,
      destination: "Kandla (INIXY)",
      speedAtWindow: "5.1 kn",
      heading: "060°",
      distanceToOrigin: 1.8,
      proximityScore: 96,
      temporalOverlap: "High",
      temporalScore: 94,
      aisStatus: "Abrupt Course & Speed Deviation",
      aisScore: 88,
      vesselRiskFactor: 90,
      suspicionScore: 92,
      confidenceRating: "HIGH CONFIDENCE ATTRIBUTION",
      status: "PRIMARY SUSPECT",
      aisTrajectory: [
        { lat: 22.250, lon: 68.850, time: "2026-11-16 18:00", speed: 12.0, status: "Normal" },
        { lat: 22.285, lon: 68.980, time: "2026-11-16 19:30", speed: 5.1, status: "Sharp Slowdown at Origin" },
        { lat: 22.340, lon: 69.050, time: "2026-11-16 22:00", speed: 11.8, status: "Resumed Speed" }
      ],
      anomalyRationale: [
        "Reduced speed to 5.1 kn right within the tidal eddy zone where spill was initiated.",
        "Tank washings discharge suspected prior to entering Gulf of Kutch Pilotage."
      ]
    }
  ]
};

export const getVesselsForIncident = (incidentId) => {
  return VESSEL_CANDIDATES[incidentId] || VESSEL_CANDIDATES["VR-2026-001"];
};
