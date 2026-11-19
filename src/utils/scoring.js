// VARUNA Maritime Intelligence — Vessel Attribution Scoring Engine
// Formula: S = 0.4 * P + 0.3 * T + 0.2 * A + 0.1 * R
// Where:
// P = Proximity Score (inverse distance to reconstructed origin waypoint)
// T = Temporal Overlap Score (coincidence with backward drift release window)
// A = AIS Anomaly Score (transponder blackouts, speed drops, abrupt track deviations)
// R = Vessel Risk Factor (crude oil tanker, products tanker, bulk carrier slop potential)

export const WEIGHTS = {
  proximity: 0.40,
  temporal: 0.30,
  aisAnomaly: 0.20,
  vesselRisk: 0.10,
};

export const calculateSuspicionScore = (vessel) => {
  const p = vessel.proximityScore ?? 50;
  const t = vessel.temporalScore ?? 50;
  const a = vessel.aisScore ?? 50;
  const r = vessel.vesselRiskFactor ?? 50;

  const score = Math.round(
    WEIGHTS.proximity * p +
    WEIGHTS.temporal * t +
    WEIGHTS.aisAnomaly * a +
    WEIGHTS.vesselRisk * r
  );

  return {
    totalScore: score,
    breakdown: {
      proximityContribution: (WEIGHTS.proximity * p).toFixed(1),
      temporalContribution: (WEIGHTS.temporal * t).toFixed(1),
      aisContribution: (WEIGHTS.aisAnomaly * a).toFixed(1),
      riskContribution: (WEIGHTS.vesselRisk * r).toFixed(1),
    },
    formulaString: `S = 0.40 × ${p} + 0.30 × ${t} + 0.20 × ${a} + 0.10 × ${r} = ${score}/100`,
    tier:
      score >= 80 ? "HIGH SUSPICION (PRIMARY INVESTIGATION TARGET)" :
      score >= 60 ? "MODERATE SUSPICION (SECONDARY INQUIRY)" :
      score >= 40 ? "LOW SUSPICION (MONITORED TRANSIT)" :
      "CLEARED / EXCLUDED"
  };
};
