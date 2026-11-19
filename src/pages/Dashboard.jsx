import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertOctagon, 
  Search, 
  Flame, 
  Ship, 
  MapPin, 
  ArrowRight, 
  Layers, 
  Satellite, 
  Compass, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useIncident } from '../context/IncidentContext';
import { ANALYTICS_DATA } from '../data/analyticsData';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PageHeader from '../components/PageHeader';

export default function Dashboard() {
  const { incidents, currentIncident, setSelectedIncidentId } = useIncident();
  const navigate = useNavigate();

  const handleSelectAndNavigate = (incidentId, destinationPath) => {
    setSelectedIncidentId(incidentId);
    if (destinationPath) {
      navigate(destinationPath);
    }
  };

  return (
    <div>
      <PageHeader
        title="Maritime Command & Investigation Center"
        subtitle="Real-time multi-sensor synthetic aperture radar (SAR) surveillance, backward hydrodynamic drift reconstruction, and dark vessel attribution."
        tag="DEFENCE & CIVIL MARITIME SURVEILLANCE"
        actions={
          <button 
            className="btn-primary"
            onClick={() => navigate('/satellite')}
          >
            <Satellite size={15} />
            <span>Launch Satellite Analysis</span>
          </button>
        }
      />

      {/* Top Telemetry KPI Cards */}
      <div style={styles.kpiGrid}>
        <StatCard
          title="Total Incidents Monitored"
          value={ANALYTICS_DATA.summaryMetrics.totalIncidentsDetected}
          subtitle="Indian EEZ & International Waters"
          icon={AlertOctagon}
          color="teal"
          trend="+3 this month"
          glow
        />
        <StatCard
          title="Active Investigations"
          value={ANALYTICS_DATA.summaryMetrics.activeInvestigations}
          subtitle="Corridor Origin & AIS In Progress"
          icon={Search}
          color="blue"
          trend="6 cases queued"
        />
        <StatCard
          title="High-Priority Alerts"
          value={ANALYTICS_DATA.summaryMetrics.highPriorityAlerts}
          subtitle="Threatening Critical Coastal Reefs"
          icon={Flame}
          color="red"
          trend="Action required"
          glow
        />
        <StatCard
          title="Vessels Flagged for Inquiry"
          value={ANALYTICS_DATA.summaryMetrics.flaggedVesselsTotal}
          subtitle="AIS Gaps & Track Deviations"
          icon={Ship}
          color="amber"
          trend="87% top confidence"
        />
      </div>

      {/* Primary Demonstration Scenario Banner */}
      <div style={styles.demoBanner}>
        <div style={styles.demoBannerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span className="badge badge-red">
              <span className="pulse-dot pulse-dot-red" />
              NATIONAL STARTUP AWARDS · CORE DEMO CASE
            </span>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              Case Ref: <strong>{currentIncident.id}</strong>
            </span>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
            {currentIncident.name} — {currentIncident.location}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 880, lineHeight: 1.5 }}>
            {currentIncident.description}
          </p>

          <div style={styles.demoWorkflowSteps}>
            <div 
              style={styles.workflowStep} 
              onClick={() => navigate('/satellite')}
              title="Click to view Sentinel-1 SAR Detection"
            >
              <div style={styles.stepNum}>01</div>
              <div>
                <div style={styles.stepTitle}>SAR Detection</div>
                <div style={styles.stepDetail}>12.8 km² slick · 94% Conf.</div>
              </div>
              <ChevronRight size={16} color="var(--accent-primary)" />
            </div>

            <div 
              style={styles.workflowStep} 
              onClick={() => navigate('/origin')}
              title="Click to view Backward Drift Modeling"
            >
              <div style={styles.stepNum}>02</div>
              <div>
                <div style={styles.stepTitle}>Origin Reconstruction</div>
                <div style={styles.stepDetail}>6.5h drift · Wind/Current solver</div>
              </div>
              <ChevronRight size={16} color="var(--accent-secondary)" />
            </div>

            <div 
              style={styles.workflowStep} 
              onClick={() => navigate('/vessels')}
              title="Click to view AIS Vessel Attribution"
            >
              <div style={styles.stepNum}>03</div>
              <div>
                <div style={styles.stepTitle}>Vessel Attribution</div>
                <div style={styles.stepDetail}>MV Ocean Pioneer (87/100)</div>
              </div>
              <ChevronRight size={16} color="var(--status-warning)" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Incidents Table & Activity Feed */}
      <div style={styles.mainGrid}>
        {/* Left Column: Incidents Registry */}
        <div className="varuna-card" style={{ gridColumn: 'span 8' }}>
          <div className="varuna-card-header">
            <div className="varuna-card-title">
              <Layers size={17} color="var(--accent-primary)" />
              <span>Surveillance Incident Registry</span>
              <span className="badge badge-teal" style={{ marginLeft: 8 }}>
                {incidents.length} Simulated Cases
              </span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Click row to switch active investigation
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="varuna-table">
              <thead>
                <tr>
                  <th>Incident ID</th>
                  <th>Region / Location</th>
                  <th>Severity</th>
                  <th>Area (km²)</th>
                  <th>AI Conf.</th>
                  <th>Suspect Vessel</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => {
                  const isSelected = inc.id === currentIncident.id;
                  return (
                    <tr 
                      key={inc.id}
                      className={isSelected ? 'selected' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedIncidentId(inc.id)}
                    >
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {isSelected && <span className="pulse-dot" style={{ width: 6, height: 6 }} />}
                          <span style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-main)' }}>
                            {inc.id}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{inc.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{inc.region}</div>
                      </td>
                      <td>
                        <StatusBadge status={inc.severity} size="sm" />
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {inc.spillArea} km²
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
                        {inc.confidence}%
                      </td>
                      <td>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>
                          {inc.topCandidate.name}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--status-warning)' }}>
                          Score: {inc.topCandidate.suspicionScore}/100
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn-secondary"
                          style={{ padding: '4px 8px', fontSize: 11 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectAndNavigate(inc.id, '/map');
                          }}
                        >
                          <MapPin size={12} />
                          <span>Map</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Real-Time Activity & Monthly Trend */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Activity Feed */}
          <div className="varuna-card">
            <div className="varuna-card-header">
              <div className="varuna-card-title">
                <Clock size={16} color="var(--accent-secondary)" />
                <span>Operational Activity Feed</span>
              </div>
              <span className="pulse-dot" />
            </div>

            <div style={styles.activityList}>
              {ANALYTICS_DATA.recentActivityFeed.map((act) => (
                <div key={act.id} style={styles.activityItem}>
                  <div style={{ ...styles.activityIndicator, backgroundColor: act.badgeColor }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>
                        {act.title}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {act.timestamp}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
                      {act.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Spill Area Trend Chart */}
          <div className="varuna-card">
            <div className="varuna-card-header">
              <div className="varuna-card-title">
                <TrendingUp size={16} color="var(--status-warning)" />
                <span>Detection Volume Trend</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                km² Surface Area
              </span>
            </div>

            <div style={{ width: '100%', height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_DATA.monthlyTrends}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stop-color="#18B6A4" stop-opacity={0.4}/>
                      <stop offset="95%" stop-color="#18B6A4" stop-opacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A3B54" />
                  <XAxis dataKey="month" stroke="#647C90" fontSize={10} />
                  <YAxis stroke="#647C90" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#102B40', borderColor: '#18B6A4', fontSize: 11 }}
                    itemStyle={{ color: '#F5F8FA' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalAreaKm2" 
                    name="Area (km²)" 
                    stroke="#18B6A4" 
                    fillOpacity={1} 
                    fill="url(#areaGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 20,
  },
  demoBanner: {
    backgroundColor: '#0E2638',
    border: '1px solid rgba(24, 182, 164, 0.4)',
    borderRadius: 'var(--radius-md)',
    padding: '20px 24px',
    marginBottom: 24,
    backgroundImage: 'radial-gradient(ellipse at top right, rgba(24, 182, 164, 0.08) 0%, transparent 70%)',
    boxShadow: '0 4px 20px rgba(7, 24, 39, 0.5)',
  },
  demoBannerContent: {
    position: 'relative',
  },
  demoWorkflowSteps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 12,
    marginTop: 16,
  },
  workflowStep: {
    backgroundColor: 'rgba(16, 43, 64, 0.8)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 6,
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#071827',
    border: '1px solid var(--accent-primary)',
    color: 'var(--accent-primary)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  stepDetail: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: 20,
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    paddingBottom: 12,
    borderBottom: '1px solid rgba(26, 59, 84, 0.4)',
  },
  activityIndicator: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    marginTop: 5,
    flexShrink: 0,
  },
};
