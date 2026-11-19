import React, { useState } from 'react';
import { X, AlertTriangle, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

export default function VesselDetailsDrawer({ 
  isOpen, 
  onClose, 
  selectedTarget, 
  onSelectTarget,
  onOpenReport 
}) {
  const { vessels } = useIncident();
  const [flagged, setFlagged] = useState(false);

  if (!isOpen) return null;

  // Active target details (defaults to #42 / MV Ocean Pioneer or selected)
  const target = selectedTarget || {
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
  };

  return (
    <aside className="vessel-details-panel">
      {/* Drawer Header */}
      <div className="details-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--accent-orange)' }} />
          <span className="details-title">
            VESSEL DETAILS: {target.label}
          </span>
        </div>
        <button className="close-panel-btn" onClick={onClose} title="Close Panel">
          <X size={16} />
        </button>
      </div>

      <div className="details-body-scrollable">
        {/* Quick Target Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--text-muted)' }}>SELECT TRACK TARGET:</span>
          <select 
            style={{
              background: '#07121a',
              color: 'var(--accent-orange)',
              border: '1px solid var(--border-panel)',
              borderRadius: 3,
              padding: '2px 6px',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              outline: 'none',
              cursor: 'pointer'
            }}
            onChange={(e) => {
              const matched = vessels.find(v => v.id === e.target.value);
              if (matched) {
                onSelectTarget({
                  label: `TARGET: ${matched.name}`,
                  mmsi: matched.callSign || "N/A",
                  imo: matched.id,
                  callSign: matched.callSign,
                  flag: matched.flag,
                  status: matched.suspicionScore >= 80 ? "HIGH CONFIDENCE ATTRIBUTION / DARK VESSEL" : "MONITORED TRANSIT",
                  source: "OPTICAL & SAR FUSION",
                  confidence: `${matched.suspicionScore}%`,
                  length: `${matched.length}m`,
                  width: `${matched.beam}m`,
                  tonnage: `${matched.dwt.toLocaleString()} DWT`,
                  classifiedType: matched.type,
                  lastDetected: "2026-11-15 04:22:00 UTC",
                  firstDetected: "2026-11-14 18:00:00 UTC",
                  speed: matched.speedAtWindow,
                  heading: matched.heading,
                  lastAisPos: `${matched.distanceToOrigin} km from origin`,
                  notes: matched.anomalyRationale ? matched.anomalyRationale.join(' ') : "Transponder blackout coincident with oil spill origin coordinates."
                });
              }
            }}
          >
            <option value="default">#42 (UNMATCHED DARK TARGET)</option>
            {vessels.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
            ))}
          </select>
        </div>

        {/* 1. SATELLITE CAPTURE (OPTICAL/SAR) */}
        <div className="satellite-capture-box">
          <img 
            src="/images/satellite_capture.svg" 
            alt="Satellite Capture with Bounding Box" 
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 2 }}
          />
          <div className="satellite-capture-label">
            SATELLITE CAPTURE (OPTICAL / SAR SPOTLIGHT)
          </div>
        </div>

        {/* 2. IDENTIFICATION & STATUS */}
        <div>
          <div className="details-section-title">IDENTIFICATION & STATUS</div>
          <div className="telemetry-row">
            <span className="telemetry-key">MMSI:</span>
            <span className="telemetry-val">{target.mmsi}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-key">IMO:</span>
            <span className="telemetry-val">{target.imo}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-key">CALL SIGN:</span>
            <span className="telemetry-val">{target.callSign}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-key">FLAG:</span>
            <span className="telemetry-val">{target.flag}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-key">STATUS:</span>
            <span className="telemetry-val-highlight">{target.status}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-key">DETECTION SOURCE:</span>
            <span className="telemetry-val">{target.source}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-key">CONFIDENCE:</span>
            <span className="telemetry-val-green">{target.confidence}</span>
          </div>
        </div>

        {/* 3. PHYSICAL CHARACTERISTICS */}
        <div>
          <div className="details-section-title">PHYSICAL CHARACTERISTICS</div>
          <div className="telemetry-row">
            <span className="telemetry-key">EST. LENGTH:</span>
            <span className="telemetry-val">{target.length}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-key">EST. WIDTH:</span>
            <span className="telemetry-val">{target.width}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-key">EST. GROSS TONNAGE:</span>
            <span className="telemetry-val">{target.tonnage}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-key">VESSEL TYPE (CLASSIFIED):</span>
            <span className="telemetry-val">{target.classifiedType}</span>
          </div>
        </div>

        {/* 4. MOVEMENT & TIMESTAMPS */}
        <div>
          <div className="details-section-title">MOVEMENT & TIMESTAMPS</div>
          <div className="telemetry-row">
            <span className="telemetry-key">LAST DETECTED:</span>
            <span className="telemetry-val">{target.lastDetected}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-key">FIRST DETECTED:</span>
            <span className="telemetry-val">{target.firstDetected}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-key">CURRENT SPEED (EST.):</span>
            <span className="telemetry-val">{target.speed}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-key">HEADING (EST.):</span>
            <span className="telemetry-val">{target.heading}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-key">LAST KNOWN AIS POSITION:</span>
            <span className="telemetry-val">{target.lastAisPos}</span>
          </div>
        </div>

        {/* 5. ANALYSIS NOTES */}
        <div>
          <div className="details-section-title">ANALYSIS NOTES</div>
          <div className="analysis-notes-box">
            {target.notes}
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="details-actions-footer">
        <button className="btn-generate-report" onClick={onOpenReport}>
          GENERATE REPORT
        </button>
        <button 
          className="btn-flag-review"
          onClick={() => setFlagged(!flagged)}
          style={{
            borderColor: flagged ? 'var(--accent-red)' : 'var(--border-panel)',
            color: flagged ? 'var(--accent-red)' : 'var(--text-secondary)'
          }}
        >
          {flagged ? "✓ TARGET FLAGGED FOR INTERCEPTION" : "FLAG FOR FURTHER REVIEW"}
        </button>
      </div>
    </aside>
  );
}
