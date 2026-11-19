import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Ship, 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Sliders,
  HelpCircle,
  Anchor
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { calculateSuspicionScore } from '../utils/scoring';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

export default function VesselAttribution() {
  const { currentIncident, vessels } = useIncident();
  const navigate = useNavigate();

  const [selectedVesselId, setSelectedVesselId] = useState(vessels[0]?.id || 'IMO-9387421');
  const selectedVessel = vessels.find(v => v.id === selectedVesselId) || vessels[0];
  const scoreData = calculateSuspicionScore(selectedVessel);

  return (
    <div>
      <PageHeader
        title="Vessel Attribution & Anomaly Intelligence"
        subtitle="Automated spatio-temporal correlation of AIS transponder tracks with backward drift release centroids."
        tag="WEIGHTED MULTI-FACTOR SCORING"
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/map')}
            >
              <MapPin size={14} />
              <span>Inspect on GIS Map</span>
            </button>
            <button 
              className="btn-primary"
              onClick={() => navigate('/analytics')}
            >
              <FileText size={15} />
              <span>Generate Case Dossier</span>
            </button>
          </div>
        }
      />

      {/* Scoring Engine Formula Banner */}
      <div style={styles.formulaBanner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge badge-teal">ALGORITHM v2.4</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            S = 0.40(P) + 0.30(T) + 0.20(A) + 0.10(R)
          </span>
        </div>
        <div style={styles.formulaWeights}>
          <span><strong>P:</strong> Proximity (40%)</span>
          <span><strong>T:</strong> Time Coincidence (30%)</span>
          <span><strong>A:</strong> AIS Anomaly / Gap (20%)</span>
          <span><strong>R:</strong> Cargo Risk (10%)</span>
        </div>
      </div>

      {/* Main Grid: Candidates List & Selected Vessel Intelligence Dossier */}
      <div style={styles.mainGrid}>
        {/* Left Column: Ranked Candidates Table */}
        <div className="varuna-card" style={{ gridColumn: 'span 7' }}>
          <div className="varuna-card-header">
            <div className="varuna-card-title">
              <Ship size={17} color="var(--accent-primary)" />
              <span>Ranked Candidate Vessels</span>
              <span className="badge badge-amber" style={{ marginLeft: 8 }}>
                {vessels.length} Evaluated Ships
              </span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Click to inspect forensic dossier
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {vessels.map((vessel, index) => {
              const isSelected = vessel.id === selectedVessel.id;
              const isTop = index === 0;

              return (
                <div
                  key={vessel.id}
                  style={{
                    ...styles.vesselCard,
                    borderColor: isSelected 
                      ? 'var(--accent-primary)' 
                      : isTop 
                      ? 'rgba(232, 117, 101, 0.4)' 
                      : 'var(--border-subtle)',
                    backgroundColor: isSelected ? 'rgba(24, 182, 164, 0.08)' : 'var(--bg-card)',
                  }}
                  onClick={() => setSelectedVesselId(vessel.id)}
                >
                  <div style={styles.vesselCardTop}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        ...styles.rankBadge,
                        backgroundColor: isTop ? '#E87565' : '#1A3B54',
                        color: isTop ? '#071827' : '#F5F8FA'
                      }}>
                        #{index + 1}
                      </span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                          {vessel.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {vessel.id} • Flag: {vessel.flag}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: 20,
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        color: vessel.suspicionScore >= 80 ? 'var(--status-danger)' : vessel.suspicionScore >= 60 ? 'var(--status-warning)' : 'var(--accent-primary)'
                      }}>
                        {vessel.suspicionScore} <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/100</span>
                      </div>
                      <StatusBadge status={vessel.status} size="sm" />
                    </div>
                  </div>

                  <div style={styles.vesselCardMetrics}>
                    <div>
                      <span style={{ fontSize: 9.5, color: 'var(--text-muted)', display: 'block' }}>TYPE</span>
                      <span style={{ fontSize: 11.5, color: 'var(--text-main)' }}>{vessel.type}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 9.5, color: 'var(--text-muted)', display: 'block' }}>DISTANCE TO ORIGIN</span>
                      <span style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                        {vessel.distanceToOrigin} km
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: 9.5, color: 'var(--text-muted)', display: 'block' }}>AIS TELEMETRY</span>
                      <span style={{ 
                        fontSize: 11.5, 
                        fontFamily: 'var(--font-mono)', 
                        color: vessel.aisStatus.includes('Gap') ? 'var(--status-danger)' : 'var(--accent-primary)' 
                      }}>
                        {vessel.aisStatus}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Forensic Dossier of Selected Vessel */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Suspicion Score Breakdown */}
          <div className="varuna-card" style={{ border: '1px solid var(--accent-primary)' }}>
            <div className="varuna-card-header">
              <div className="varuna-card-title">
                <ShieldAlert size={16} color="var(--accent-primary)" />
                <span>Score Breakdown: {selectedVessel.name}</span>
              </div>
              <span className="badge badge-teal">
                {scoreData.totalScore}/100
              </span>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                WEIGHTED MULTI-CRITERIA EVALUATION:
              </div>

              {/* Progress Bars for 4 factors */}
              <div style={styles.factorRow}>
                <div style={styles.factorLabel}>
                  <span>Proximity Score (P: 40%)</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedVessel.proximityScore}/100</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div style={{ ...styles.progressBarFill, width: `${selectedVessel.proximityScore}%`, backgroundColor: 'var(--accent-primary)' }} />
                </div>
              </div>

              <div style={styles.factorRow}>
                <div style={styles.factorLabel}>
                  <span>Temporal Coincidence (T: 30%)</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedVessel.temporalScore}/100</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div style={{ ...styles.progressBarFill, width: `${selectedVessel.temporalScore}%`, backgroundColor: 'var(--accent-secondary)' }} />
                </div>
              </div>

              <div style={styles.factorRow}>
                <div style={styles.factorLabel}>
                  <span>AIS Anomaly / Gap (A: 20%)</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedVessel.aisScore}/100</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div style={{ ...styles.progressBarFill, width: `${selectedVessel.aisScore}%`, backgroundColor: 'var(--status-danger)' }} />
                </div>
              </div>

              <div style={styles.factorRow}>
                <div style={styles.factorLabel}>
                  <span>Vessel Risk Factor (R: 10%)</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedVessel.vesselRiskFactor}/100</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div style={{ ...styles.progressBarFill, width: `${selectedVessel.vesselRiskFactor}%`, backgroundColor: 'var(--status-warning)' }} />
                </div>
              </div>
            </div>

            <div style={styles.formulaResultBox}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CALCULATION TRACE:
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-main)', marginTop: 2 }}>
                {scoreData.formulaString}
              </div>
            </div>
          </div>

          {/* Anomaly Rationale Card */}
          <div className="varuna-card">
            <div className="varuna-card-header">
              <div className="varuna-card-title">
                <AlertTriangle size={16} color="var(--status-warning)" />
                <span>Forensic Investigation Rationale</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedVessel.anomalyRationale.map((rationale, idx) => (
                <div key={idx} style={styles.rationaleItem}>
                  <div style={styles.rationaleDot} />
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="varuna-card">
            <div className="varuna-card-header">
              <div className="varuna-card-title">
                <Anchor size={15} color="var(--text-secondary)" />
                <span>Vessel Telemetry Specs</span>
              </div>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                DWT: {selectedVessel.dwt.toLocaleString()} t
              </span>
            </div>

            <div style={styles.specsGrid}>
              <div>
                <span style={styles.specLabel}>LENGTH / BEAM</span>
                <span style={styles.specVal}>{selectedVessel.length}m × {selectedVessel.beam}m</span>
              </div>
              <div>
                <span style={styles.specLabel}>BUILT YEAR</span>
                <span style={styles.specVal}>{selectedVessel.yearBuilt}</span>
              </div>
              <div>
                <span style={styles.specLabel}>DESTINATION</span>
                <span style={styles.specVal}>{selectedVessel.destination}</span>
              </div>
              <div>
                <span style={styles.specLabel}>SPEED PROFILE</span>
                <span style={{ ...styles.specVal, color: 'var(--status-warning)' }}>
                  {selectedVessel.speedAtWindow}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  formulaBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 43, 64, 0.7)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 20px',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  formulaWeights: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: 20,
  },
  vesselCard: {
    borderRadius: 6,
    border: '1px solid var(--border-subtle)',
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  vesselCardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rankBadge: {
    width: 26,
    height: 26,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
  },
  vesselCardMetrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
    paddingTop: 8,
    borderTop: '1px solid rgba(26, 59, 84, 0.5)',
  },
  factorRow: {
    marginBottom: 10,
  },
  factorLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    color: 'var(--text-secondary)',
    marginBottom: 4,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(7, 24, 39, 0.8)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.4s ease',
  },
  formulaResultBox: {
    padding: '8px 12px',
    backgroundColor: 'rgba(7, 24, 39, 0.7)',
    borderRadius: 4,
    border: '1px solid var(--border-subtle)',
  },
  rationaleItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
  },
  rationaleDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    backgroundColor: 'var(--status-warning)',
    marginTop: 6,
    flexShrink: 0,
  },
  specsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
  },
  specLabel: {
    fontSize: 9.5,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    display: 'block',
  },
  specVal: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-main)',
  },
};
