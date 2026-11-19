import React from 'react';

export default function StatusBadge({ status, size = 'normal' }) {
  const getBadgeConfig = (statusText = '') => {
    const s = statusText.toLowerCase();
    if (s.includes('critical') || s.includes('primary suspect') || s.includes('gap detected') || s.includes('danger')) {
      return { class: 'badge-red', dot: 'pulse-dot-red', label: statusText };
    }
    if (s.includes('high') || s.includes('under investigation') || s.includes('warning') || s.includes('review')) {
      return { class: 'badge-amber', dot: 'pulse-dot-amber', label: statusText };
    }
    if (s.includes('moderate') || s.includes('secondary')) {
      return { class: 'badge-blue', dot: null, label: statusText };
    }
    return { class: 'badge-teal', dot: 'pulse-dot', label: statusText };
  };

  const config = getBadgeConfig(status);

  return (
    <span className={`badge ${config.class}`} style={{ fontSize: size === 'sm' ? 10 : 11 }}>
      {config.dot && <span className={`pulse-dot ${config.dot}`} style={{ width: 6, height: 6 }} />}
      {config.label}
    </span>
  );
}
