import React from 'react';
import { useIncident } from '../context/IncidentContext';

export default function PageHeader({ 
  title, 
  subtitle, 
  tag, 
  actions 
}) {
  const { currentIncident } = useIncident();

  return (
    <div style={styles.container}>
      <div style={styles.textWrap}>
        <div style={styles.tagRow}>
          {tag && <span style={styles.tag}>{tag}</span>}
          <span style={styles.incidentContext}>
            Case Focus: <strong style={{ color: 'var(--text-main)' }}>{currentIncident.id}</strong> ({currentIncident.location})
          </span>
        </div>
        <h1 style={styles.title}>{title}</h1>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>

      {actions && (
        <div style={styles.actionsWrap}>
          {actions}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
    flexWrap: 'wrap',
  },
  textWrap: {
    flex: 1,
  },
  tagRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  tag: {
    backgroundColor: 'rgba(24, 182, 164, 0.15)',
    border: '1px solid var(--accent-primary)',
    color: 'var(--accent-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 3,
    letterSpacing: '0.8px',
  },
  incidentContext: {
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: '0.5px',
    color: 'var(--text-main)',
  },
  subtitle: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    marginTop: 4,
    maxWidth: 800,
  },
  actionsWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
};
