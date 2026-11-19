import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  Satellite, 
  Compass, 
  Ship, 
  MapPin, 
  BarChart3, 
  ShieldCheck, 
  AlertTriangle,
  Radio,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

export default function Sidebar() {
  const { currentIncident, incidents, setSelectedIncidentId } = useIncident();

  const navItems = [
    { path: '/', label: 'Command Center', icon: Activity, badge: 'LIVE' },
    { path: '/satellite', label: 'Satellite Detection', icon: Satellite, badge: 'SAR' },
    { path: '/origin', label: 'Origin Reconstruction', icon: Compass, badge: 'DRIFT' },
    { path: '/vessels', label: 'Vessel Attribution', icon: Ship, badge: 'AIS' },
    { path: '/map', label: 'GIS Intelligence Map', icon: MapPin, badge: 'GEO' },
    { path: '/analytics', label: 'Analytics & Reports', icon: BarChart3, badge: 'INTEL' },
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brandHeader}>
        <div style={styles.brandLogoRow}>
          <div style={styles.logoBadge}>
            <img src="/logo.svg" alt="VARUNA Logo" style={{ width: 34, height: 34 }} />
          </div>
          <div>
            <div style={styles.brandTitle}>VARUNA</div>
            <div style={styles.brandSubtitle}>MARITIME INTELLIGENCE</div>
          </div>
        </div>
        <div style={styles.acronymPill} title="Vessel Attribution through Remote Sensing and Uncertainty-aware Navigation Analytics">
          <span style={styles.acronymLetters}>V.A.R.U.N.A.</span>
          <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>SIH-26143</span>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav style={styles.navSection}>
        <div style={styles.navSectionLabel}>OPERATIONAL MODULES</div>
        <ul style={styles.navList}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path} style={{ marginBottom: 4 }}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    ...styles.navLink,
                    backgroundColor: isActive ? 'rgba(24, 182, 164, 0.12)' : 'transparent',
                    borderColor: isActive ? 'var(--accent-primary)' : 'transparent',
                    color: isActive ? 'var(--text-main)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 400,
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <Icon 
                        size={18} 
                        color={isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'} 
                        style={{ flexShrink: 0 }}
                      />
                      <span style={{ flex: 1, letterSpacing: '0.3px' }}>{item.label}</span>
                      <span style={{
                        ...styles.miniBadge,
                        backgroundColor: isActive ? 'rgba(24, 182, 164, 0.25)' : 'rgba(16, 43, 64, 0.8)',
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                        borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'
                      }}>
                        {item.badge}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Active Incident Sidebar Context Card */}
      <div style={styles.incidentContextCard}>
        <div style={styles.contextHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 600 }}>
              LOADED INCIDENT
            </span>
          </div>
          <span style={{ fontSize: 10, color: 'var(--status-warning)', fontFamily: 'var(--font-mono)' }}>
            {currentIncident.severity.toUpperCase()}
          </span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', marginTop: 4 }}>
          {currentIncident.id}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
          {currentIncident.location}
        </div>
        <div style={styles.contextStatsRow}>
          <div>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', display: 'block' }}>AREA</span>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
              {currentIncident.spillArea} km²
            </span>
          </div>
          <div>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', display: 'block' }}>CONFIDENCE</span>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
              {currentIncident.confidence}%
            </span>
          </div>
          <div>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', display: 'block' }}>CANDIDATES</span>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--status-warning)' }}>
              {currentIncident.flaggedVesselsCount} Ships
            </span>
          </div>
        </div>

        {/* Quick Switch Dropdown */}
        <div style={{ marginTop: 10 }}>
          <label style={{ fontSize: 9, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
            SWITCH DEMO CASE:
          </label>
          <select 
            value={currentIncident.id} 
            onChange={(e) => setSelectedIncidentId(e.target.value)}
            style={styles.incidentSelect}
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} — {inc.region} ({inc.spillArea} km²)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Status / Footer */}
      <div style={styles.footer}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Radio size={12} color="var(--accent-primary)" />
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
              TELEMETRY: ACTIVE
            </span>
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            SECURE
          </span>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.3 }}>
          National Startup Awards · SIH26143
          <br />
          <span style={{ color: 'var(--text-secondary)' }}>Vessel Attribution Engine v2.4</span>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    backgroundColor: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border-subtle)',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 50,
  },
  brandHeader: {
    padding: '18px 20px',
    borderBottom: '1px solid var(--border-subtle)',
    background: 'rgba(7, 24, 39, 0.6)',
  },
  brandLogoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    background: 'radial-gradient(circle, #102B40 0%, #071827 100%)',
    border: '1px solid var(--accent-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(24, 182, 164, 0.25)',
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: 2,
    color: '#FFFFFF',
    lineHeight: 1.1,
  },
  brandSubtitle: {
    fontSize: 9.5,
    letterSpacing: 1.2,
    color: 'var(--accent-primary)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
  },
  acronymPill: {
    marginTop: 10,
    padding: '4px 8px',
    borderRadius: 4,
    background: 'rgba(16, 43, 64, 0.7)',
    border: '1px solid rgba(26, 59, 84, 0.8)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'help',
  },
  acronymLetters: {
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    letterSpacing: 0.5,
  },
  navSection: {
    padding: '16px 14px',
    flex: 1,
    overflowY: 'auto',
  },
  navSectionLabel: {
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    letterSpacing: 1,
    color: 'var(--text-muted)',
    marginBottom: 10,
    paddingLeft: 8,
  },
  navList: {
    listStyle: 'none',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 6,
    textDecoration: 'none',
    fontSize: 13,
    borderLeftWidth: 3,
    borderLeftStyle: 'solid',
    transition: 'all 0.15s ease',
  },
  miniBadge: {
    fontSize: 9,
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    padding: '2px 5px',
    borderRadius: 3,
    border: '1px solid transparent',
  },
  incidentContextCard: {
    margin: '12px 14px',
    padding: '12px',
    borderRadius: 6,
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
  },
  contextHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contextStatsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1px solid rgba(26, 59, 84, 0.5)',
  },
  incidentSelect: {
    width: '100%',
    backgroundColor: '#071827',
    color: 'var(--text-main)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 4,
    padding: '4px 6px',
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    outline: 'none',
  },
  footer: {
    padding: '14px 18px',
    borderTop: '1px solid var(--border-subtle)',
    background: 'rgba(7, 24, 39, 0.4)',
  },
};
