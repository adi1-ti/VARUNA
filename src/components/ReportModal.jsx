import React from 'react';
import { X, Printer, Download, Shield, AlertTriangle } from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

export default function ReportModal({ isOpen, onClose, target }) {
  const { currentIncident, environmentalData, satelliteScene } = useIncident();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const data = {
      caseId: currentIncident.id,
      timestamp: new Date().toISOString(),
      classification: "CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE",
      targetEntity: target || { label: "UNMATCHED TARGET #42", type: "TANKER / BULK CARRIER" },
      incidentLocation: currentIncident.location,
      coordinates: currentIncident.coordinates,
      reconstructedOrigin: environmentalData.reconstructedOrigin,
      satelliteSensor: satelliteScene.mission,
      resolution: satelliteScene.spatialResolution,
      metOcean: {
        wind: `${environmentalData.windSpeedKnots} kn @ ${environmentalData.windDirectionDeg}°`,
        current: `${environmentalData.oceanCurrentSpeedMs} m/s @ ${environmentalData.oceanCurrentDirectionDeg}°`
      },
      recommendedEnforcement: [
        "Issue alert to Maritime Rescue Coordination Centre (MRCC) Mumbai",
        "Deploy Indian Coast Guard Dornier 228 maritime reconnaissance aircraft",
        "Detain vessel at next port of call under UNCLOS Article 217"
      ]
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VARUNA-CASE-DOSSIER-${currentIncident.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.svg" alt="VARUNA" style={{ width: 28, height: 28 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1.5, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                VARUNA FORENSIC MARITIME DOSSIER
              </div>
              <div style={{ fontSize: 9.5, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
                CASE ID: {currentIncident.id} · CLASSIFIED LAW ENFORCEMENT REPORT
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn-apply-filters" style={{ width: 'auto', padding: '4px 10px', fontSize: 10 }} onClick={handleDownloadJSON}>
              <Download size={12} style={{ display: 'inline', marginRight: 4 }} />
              Export JSON
            </button>
            <button className="btn-generate-report" style={{ width: 'auto', padding: '4px 10px', fontSize: 10 }} onClick={handlePrint}>
              <Printer size={12} style={{ display: 'inline', marginRight: 4 }} />
              Print Dossier
            </button>
            <button style={styles.closeBtn} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={styles.body}>
          {/* Target Profile Card */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionTitle}>1. IDENTIFIED TARGET OF INTEREST</div>
            <div style={styles.grid2Col}>
              <div>
                <span style={styles.label}>TARGET DESIGNATION:</span>
                <span style={styles.val}>{target?.label || "UNMATCHED TARGET #42"}</span>
              </div>
              <div>
                <span style={styles.label}>VESSEL CLASSIFICATION:</span>
                <span style={styles.val}>{target?.classifiedType || "TANKER / BULK CARRIER (EST. 35,000 GT)"}</span>
              </div>
              <div>
                <span style={styles.label}>AIS STATUS:</span>
                <span style={{ ...styles.val, color: 'var(--accent-orange)' }}>
                  {target?.mmsi || "N/A (TRANSPONDER INACTIVE / GHOSTING DETECTED)"}
                </span>
              </div>
              <div>
                <span style={styles.label}>PHYSICAL DIMENSIONS:</span>
                <span style={styles.val}>{target?.length || "185m"} Length × {target?.width || "28m"} Beam</span>
              </div>
            </div>
          </div>

          {/* Satellite & Oil Spill Observation */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionTitle}>2. MULTI-MODAL SATELLITE DETECTION</div>
            <div style={styles.grid2Col}>
              <div>
                <span style={styles.label}>SENSOR PLATFORM:</span>
                <span style={styles.val}>{satelliteScene.mission} (C-SAR Dual-Pol + Optical Fusion)</span>
              </div>
              <div>
                <span style={styles.label}>HYDROCARBON DISCHARGE:</span>
                <span style={styles.val}>{currentIncident.spillArea} km² ({currentIncident.estimatedVolume})</span>
              </div>
              <div>
                <span style={styles.label}>AI DETECTION CONFIDENCE:</span>
                <span style={{ ...styles.val, color: 'var(--accent-green)' }}>{currentIncident.confidence}%</span>
              </div>
              <div>
                <span style={styles.label}>SLICK CENTROID:</span>
                <span style={styles.valMono}>{currentIncident.coordinates[0]}°N, {currentIncident.coordinates[1]}°E</span>
              </div>
            </div>
          </div>

          {/* Hydrodynamic Drift Origin */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionTitle}>3. BACKWARD DRIFT RECONSTRUCTION SUMMARY</div>
            <div style={styles.grid2Col}>
              <div>
                <span style={styles.label}>RECONSTRUCTED ORIGIN:</span>
                <span style={{ ...styles.valMono, color: 'var(--accent-amber)' }}>
                  {environmentalData.reconstructedOrigin.lat}°N, {environmentalData.reconstructedOrigin.lon}°E (±3.2 km)
                </span>
              </div>
              <div>
                <span style={styles.label}>SOURCE TIME WINDOW:</span>
                <span style={styles.valMono}>{environmentalData.reconstructedOrigin.estimatedTimeWindow}</span>
              </div>
              <div>
                <span style={styles.label}>FORCING VECTORS:</span>
                <span style={styles.val}>
                  Wind: {environmentalData.windSpeedKnots} kn @ {environmentalData.windDirectionDeg}° | Current: {environmentalData.oceanCurrentSpeedMs} m/s
                </span>
              </div>
              <div>
                <span style={styles.label}>DISPERSION PARTICLES:</span>
                <span style={styles.val}>{environmentalData.particleCount} Lagrangian Tracers (89% Confidence)</span>
              </div>
            </div>
          </div>

          {/* Forensic Notes & Enforcement Actions */}
          <div style={{ ...styles.sectionCard, borderBottom: 'none' }}>
            <div style={styles.sectionTitle}>4. INVESTIGATION RATIONALE & ENFORCEMENT PROTOCOL</div>
            <p style={{ fontSize: 11.5, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 8 }}>
              {target?.notes || "Vessel operated without active AIS broadcasting in high-traffic transit corridor. Erratic loitering course intersects backward drift origin centroid."}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Recommended Action: Dispatch Indian Coast Guard Offshore Patrol Vessel (OPV) or Dornier 228 for visual verification. Notify Port State Control under UNCLOS Article 217 for vessel boarding and tank slop acoustic sampling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 12, 18, 0.88)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    width: '90%',
    maxWidth: 720,
    maxHeight: '90vh',
    backgroundColor: 'rgba(13, 25, 36, 0.98)',
    border: '1px solid #38bdf8',
    borderRadius: 6,
    boxShadow: '0 0 40px rgba(56, 189, 248, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '12px 18px',
    backgroundColor: 'rgba(18, 34, 48, 0.9)',
    borderBottom: '1px solid rgba(30, 52, 71, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: 2,
  },
  body: {
    padding: '16px 20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  sectionCard: {
    paddingBottom: 12,
    borderBottom: '1px solid rgba(30, 52, 71, 0.7)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10.5,
    fontWeight: 700,
    color: '#38bdf8',
    letterSpacing: '1px',
    marginBottom: 8,
  },
  grid2Col: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
  },
  label: {
    fontSize: 9.5,
    fontFamily: 'var(--font-mono)',
    color: '#64748b',
    display: 'block',
  },
  val: {
    fontSize: 11.5,
    fontWeight: 600,
    color: '#f8fafc',
  },
  valMono: {
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    color: '#f8fafc',
  },
};
