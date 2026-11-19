// VARUNA Maritime Intelligence — Analytics, Trends & Historical Statistics

export const ANALYTICS_DATA = {
  summaryMetrics: {
    totalIncidentsDetected: 24,
    activeInvestigations: 6,
    highPriorityAlerts: 3,
    flaggedVesselsTotal: 12,
    totalAreaMonitoredKm2: 842000,
    averageAttributionConfidence: 91.4, // %
    totalSpillVolumeEstimatedBbl: 27850,
    sarPassesProcessed: 184
  },
  monthlyTrends: [
    { month: "Jun 2026", incidents: 1, totalAreaKm2: 4.2, attributedVessels: 1 },
    { month: "Jul 2026", incidents: 2, totalAreaKm2: 9.8, attributedVessels: 2 },
    { month: "Aug 2026", incidents: 4, totalAreaKm2: 18.5, attributedVessels: 3 },
    { month: "Sep 2026", incidents: 5, totalAreaKm2: 24.1, attributedVessels: 4 },
    { month: "Oct 2026", incidents: 6, totalAreaKm2: 31.0, attributedVessels: 5 },
    { month: "Nov 2026", incidents: 6, totalAreaKm2: 40.8, attributedVessels: 6 }
  ],
  severityBreakdown: [
    { name: "Critical (>15 km²)", count: 4, color: "#E87565" },
    { name: "High (10-15 km²)", count: 9, color: "#F4B942" },
    { name: "Moderate (5-10 km²)", count: 8, color: "#3987C9" },
    { name: "Low (<5 km²)", count: 3, color: "#18B6A4" }
  ],
  vesselTypeCorrelation: [
    { type: "Crude Oil Tankers", count: 11, percent: 45.8, color: "#E87565" },
    { type: "Chemical / Product Tankers", count: 7, percent: 29.2, color: "#F4B942" },
    { type: "Capesize Bulk Carriers", count: 4, percent: 16.7, color: "#3987C9" },
    { type: "Container Ships / Other", count: 2, percent: 8.3, color: "#18B6A4" }
  ],
  regionalHotspots: [
    { region: "Arabian Sea Transit Lanes", incidents: 10, riskLevel: "Extreme" },
    { region: "Gulf of Kutch & Khambhat", incidents: 6, riskLevel: "High" },
    { region: "Bay of Bengal (East Coast)", incidents: 5, riskLevel: "Medium-High" },
    { region: "Six Degree Channel (Malacca Approach)", incidents: 3, riskLevel: "Critical" }
  ],
  recentActivityFeed: [
    {
      id: "ACT-01",
      timestamp: "12 mins ago",
      type: "ALERT",
      badgeColor: "#E87565",
      title: "New AIS Anomaly Flagged",
      desc: "Vessel MV Ocean Pioneer (IMO 9387421) cross-referenced against backward drift origin for VR-2026-001. Suspicion score calculated: 87/100."
    },
    {
      id: "ACT-02",
      timestamp: "48 mins ago",
      type: "DETECTION",
      badgeColor: "#18B6A4",
      title: "Sentinel-1B Ingestion Complete",
      desc: "Scene SENTINEL1B_IW_GRDH_20261115 processed by Deep-SAR U-Net. 12.8 km² slick segmented with 94% confidence."
    },
    {
      id: "ACT-03",
      timestamp: "2 hours ago",
      type: "RECONSTRUCTION",
      badgeColor: "#3987C9",
      title: "Backward Drift Trajectory Solved",
      desc: "Met-ocean coupling converged on release origin waypoint at 19.3412°N, 66.3218°E with 3.2 km confidence radius."
    },
    {
      id: "ACT-04",
      timestamp: "4 hours ago",
      type: "INVESTIGATION",
      badgeColor: "#F4B942",
      title: "Coast Guard Dossier Formatted",
      desc: "Preliminary investigation report compiled for Incident VR-2026-002 (Gulf of Kutch)."
    }
  ]
};
