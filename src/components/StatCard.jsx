import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  unit = '', 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'teal', // teal, blue, amber, red
  glow = false 
}) {
  const colorMap = {
    teal: {
      accent: 'var(--accent-primary)',
      bg: 'rgba(24, 182, 164, 0.1)',
      border: 'rgba(24, 182, 164, 0.3)',
      shadow: '0 0 16px rgba(24, 182, 164, 0.15)'
    },
    blue: {
      accent: 'var(--accent-secondary)',
      bg: 'rgba(57, 135, 201, 0.1)',
      border: 'rgba(57, 135, 201, 0.3)',
      shadow: '0 0 16px rgba(57, 135, 201, 0.15)'
    },
    amber: {
      accent: 'var(--status-warning)',
      bg: 'rgba(244, 185, 66, 0.1)',
      border: 'rgba(244, 185, 66, 0.3)',
      shadow: '0 0 16px rgba(244, 185, 66, 0.15)'
    },
    red: {
      accent: 'var(--status-danger)',
      bg: 'rgba(232, 117, 101, 0.1)',
      border: 'rgba(232, 117, 101, 0.3)',
      shadow: '0 0 16px rgba(232, 117, 101, 0.15)'
    }
  };

  const scheme = colorMap[color] || colorMap.teal;

  return (
    <div style={{
      ...styles.card,
      borderColor: scheme.border,
      boxShadow: glow ? scheme.shadow : 'none'
    }}>
      <div style={styles.topRow}>
        <span style={styles.title}>{title}</span>
        {Icon && (
          <div style={{
            ...styles.iconWrap,
            backgroundColor: scheme.bg,
            borderColor: scheme.border
          }}>
            <Icon size={16} color={scheme.accent} />
          </div>
        )}
      </div>

      <div style={styles.valueRow}>
        <span style={{ ...styles.value, color: scheme.accent }}>
          {value}
        </span>
        {unit && <span style={styles.unit}>{unit}</span>}
      </div>

      {(subtitle || trend) && (
        <div style={styles.bottomRow}>
          {subtitle && <span style={styles.subtitle}>{subtitle}</span>}
          {trend && (
            <span style={{
              ...styles.trend,
              color: trend.startsWith('+') ? 'var(--status-danger)' : 'var(--accent-primary)'
            }}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.6px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent',
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    lineHeight: 1.1,
  },
  unit: {
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
  },
  bottomRow: {
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 11,
  },
  subtitle: {
    color: 'var(--text-muted)',
  },
  trend: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
  },
};
