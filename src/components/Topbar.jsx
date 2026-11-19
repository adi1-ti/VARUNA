import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Shield, 
  HelpCircle, 
  ExternalLink, 
  Database,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

export default function Topbar({ pageTitle }) {
  const { currentIncident, incidents, setSelectedIncidentId } = useIncident();
  const [utcTime, setUtcTime] = useState('');
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header style={styles.topbar}>
        {/* Left: Current Page / Incident Context */}
        <div style={styles.leftSection}>
          <div style={styles.pageBreadcrumb}>
            <span style={{ color: 'var(--text-muted)' }}>VARUNA</span>
            <span style={{ color: 'var(--border-subtle)' }}>/</span>
            <span style={styles.currentPageLabel}>{pageTitle || 'Command Center'}</span>
          </div>

          <div style={styles.incidentTag}>
            <span style={{ fontSize: 10, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
              ACTIVE CASE:
            </span>
            <select
              value={currentIncident.id}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              style={styles.incidentDropdown}
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.id} • {inc.region} ({inc.severity})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Telemetry & Status Badges */}
        <div style={styles.rightSection}>
          {/* UTC Clock */}
          <div style={styles.statusPill}>
            <Clock size={13} color="var(--accent-secondary)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-main)' }}>
              {utcTime || '12:00:00 UTC'}
            </span>
          </div>

          {/* Sentinel-1 Ingestion Status */}
          <div style={styles.statusPill}>
            <span className="pulse-dot" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-primary)' }}>
              SENTINEL-1B: ONLINE
            </span>
          </div>

          {/* Demonstration Notice Button */}
          <button 
            onClick={() => setShowDemoModal(true)} 
            style={styles.demoBadgeButton}
            title="Click to view National Startup Awards Demo Scenario details"
          >
            <HelpCircle size={13} color="var(--status-warning)" />
            <span>DEMO PROTOCOL</span>
          </button>
        </div>
      </header>

      {/* Demo Modal */}
      {showDemoModal && (
        <div style={styles.modalOverlay} onClick={() => setShowDemoModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={20} color="var(--accent-primary)" />
                <h3 style={{ margin: 0, fontSize: 17, color: 'var(--text-main)' }}>
                  VARUNA System Demonstration Architecture
                </h3>
              </div>
              <button 
                onClick={() => setShowDemoModal(false)}
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '18px 24px', fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              <div style={{ padding: '10px 14px', background: 'rgba(244, 185, 66, 0.1)', border: '1px solid var(--status-warning)', borderRadius: 6, marginBottom: 16 }}>
                <strong style={{ color: 'var(--status-warning)' }}>National Startup Awards 2026 Jury Demonstration:</strong>
                <p style={{ marginTop: 4, fontSize: 12 }}>
                  VARUNA executes a 3-stage intelligence chain: <strong>SAR Detection → Backward Met-Ocean Drift Reconstruction → Multi-Factor Vessel Attribution</strong>.
                  For this jury evaluation, all satellite telemetry, environmental vectors, and AIS records are orchestrated deterministically from preconfigured high-fidelity datasets.
                </p>
              </div>

              <h4 style={{ color: 'var(--text-main)', marginBottom: 8 }}>Primary Demo Walkthrough Scenario:</h4>
              <ol style={{ paddingLeft: 18, marginBottom: 16 }}>
                <li><strong>Incident Case:</strong> <code>VR-2026-001</code> (Arabian Sea, 19.2°N, 66.5°E)</li>
                <li><strong>Satellite Detection:</strong> Sentinel-1B SAR scene segmented by Deep-SAR U-Net (12.8 km² slick, 94% confidence)</li>
                <li><strong>Origin Reconstruction:</strong> Wind (14.2 kn WNW) + Current (0.65 m/s SE) yields backward drift to waypoint <code>19.3412°N, 66.3218°E</code></li>
                <li><strong>Vessel Attribution:</strong> Ranks candidate ships using weighted formula: <br />
                  <code style={{ color: 'var(--accent-primary)' }}>S = 0.40(P) + 0.30(T) + 0.20(A) + 0.10(R)</code>. Top suspect: <strong>MV Ocean Pioneer (Score: 87/100)</strong> with 3.2-hr AIS blackout.
                </li>
              </ol>

              <div style={{ textAlign: 'right', marginTop: 12 }}>
                <button 
                  onClick={() => setShowDemoModal(false)}
                  className="btn-primary"
                >
                  Continue Demonstration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  topbar: {
    height: 'var(--topbar-height)',
    backgroundColor: 'rgba(11, 32, 48, 0.95)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    position: 'sticky',
    top: 0,
    zIndex: 30,
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
  },
  pageBreadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
  },
  currentPageLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    color: 'var(--text-main)',
    fontSize: 14,
    letterSpacing: '0.5px',
  },
  incidentTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'var(--bg-primary)',
    padding: '4px 10px',
    borderRadius: 4,
    border: '1px solid var(--border-subtle)',
  },
  incidentDropdown: {
    backgroundColor: 'transparent',
    color: 'var(--text-main)',
    border: 'none',
    outline: 'none',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 43, 64, 0.7)',
    border: '1px solid var(--border-subtle)',
    padding: '5px 12px',
    borderRadius: 4,
  },
  demoBadgeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244, 185, 66, 0.12)',
    border: '1px solid rgba(244, 185, 66, 0.4)',
    color: 'var(--status-warning)',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 600,
    padding: '5px 12px',
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 24, 39, 0.85)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--accent-primary)',
    borderRadius: 8,
    width: '90%',
    maxWidth: 680,
    boxShadow: '0 0 30px rgba(24, 182, 164, 0.3)',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: '14px 20px',
    backgroundColor: 'rgba(7, 24, 39, 0.7)',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 16,
    cursor: 'pointer',
  },
};
