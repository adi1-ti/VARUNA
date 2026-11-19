import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Clock, 
  Compass, 
  Layers, 
  FileText, 
  Activity, 
  Satellite, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

export default function TacticalTopBar({ 
  currentMode, 
  setCurrentMode, 
  onOpenReportModal 
}) {
  const { currentIncident, incidents, setSelectedIncidentId } = useIncident();
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="tactical-top-hud">
      {/* Brand & Incident Selector */}
      <div className="hud-left">
        <div className="brand-badge">
          <img src="/logo.svg" alt="VARUNA" style={{ width: 28, height: 28 }} />
          <div>
            <div className="brand-title">VARUNA</div>
            <div className="brand-sub">GEOSPATIAL MARITIME INTELLIGENCE PLATFORM</div>
          </div>
        </div>

        <div className="hud-divider" />

        <div className="sector-indicator">
          <span>CASE SECTOR:</span>
          <select 
            className="incident-select-tactical"
            value={currentIncident.id}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} • {inc.region} ({inc.severity})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center Operational Modes */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          style={{
            background: currentMode === 'tactical' ? '#1e3a53' : 'transparent',
            color: currentMode === 'tactical' ? '#38bdf8' : 'var(--text-secondary)',
            border: `1px solid ${currentMode === 'tactical' ? '#38bdf8' : 'transparent'}`,
            borderRadius: 3,
            padding: '4px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
          onClick={() => setCurrentMode('tactical')}
        >
          <Layers size={13} />
          <span>GEOINT TACTICAL MAP</span>
        </button>

        <button
          style={{
            background: currentMode === 'sar' ? '#1e3a53' : 'transparent',
            color: currentMode === 'sar' ? '#38bdf8' : 'var(--text-secondary)',
            border: `1px solid ${currentMode === 'sar' ? '#38bdf8' : 'transparent'}`,
            borderRadius: 3,
            padding: '4px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
          onClick={() => setCurrentMode('sar')}
        >
          <Satellite size={13} />
          <span>SAR SPECTRAL MASK</span>
        </button>

        <button
          style={{
            background: currentMode === 'drift' ? '#1e3a53' : 'transparent',
            color: currentMode === 'drift' ? '#38bdf8' : 'var(--text-secondary)',
            border: `1px solid ${currentMode === 'drift' ? '#38bdf8' : 'transparent'}`,
            borderRadius: 3,
            padding: '4px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
          onClick={() => setCurrentMode('drift')}
        >
          <Compass size={13} />
          <span>DRIFT SOLVER</span>
        </button>
      </div>

      {/* Right HUD Telemetry */}
      <div className="hud-right">
        <div className="hud-telemetry-pill">
          <Clock size={12} color="var(--accent-blue)" />
          <span>{utcTime}</span>
        </div>

        <div className="hud-telemetry-pill">
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--accent-green)', boxShadow: '0 0 6px var(--accent-green)' }} />
          <span>SENSOR FUSION: ACTIVE</span>
        </div>

        <button 
          className="btn-generate-report" 
          style={{ padding: '4px 10px', fontSize: 10.5 }}
          onClick={onOpenReportModal}
        >
          <FileText size={12} style={{ display: 'inline', marginRight: 4 }} />
          <span>LEGAL DOSSIER</span>
        </button>
      </div>
    </header>
  );
}
