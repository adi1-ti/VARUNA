import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Printer, 
  Download, 
  PieChart as PieIcon, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { useIncident } from '../context/IncidentContext';
import { ANALYTICS_DATA } from '../data/analyticsData';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

export default function Analytics() {
  const { currentIncident, satelliteScene, environmentalData, vessels } = useIncident();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const primaryVessel = vessels[0] || {};

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      platform: "VARUNA Maritime Intelligence Platform",
      acronym: "Vessel Attribution through Remote Sensing and Uncertainty-aware Navigation Analytics",
      version: "2.4-PROTOTYPE",
      exportTimestamp: new Date().toISOString(),
      caseDetails: currentIncident,
      satelliteObservation: satelliteScene,
      metOceanConditions: environmentalData,
      attributedVessels: vessels,
      primarySuspect: primaryVessel,
      recommendedActions: [
        "Issue maritime notice to port state control at next destination port",
        "Preserve satellite raw SAR level-1 GRD telemetry for forensic chain of custody",
        "Cross-reference oil sample fingerprinting upon vessel boarding"
      ]
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VARUNA-INVESTIGATION-DOSSIER-${currentIncident.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div>
      <PageHeader
        title="Maritime Analytics & Forensic Intelligence Reports"
        subtitle="Long-term spatio-temporal trends, risk modeling, and automated Coast Guard evidentiary dossiers."
        tag="INTELLIGENCE DOSSIER GENERATOR"
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              className="btn-secondary"
              onClick={handleExportJSON}
            >
              <Download size={14} />
              <span>{downloadSuccess ? 'Dossier Downloaded!' : 'Export JSON Intel'}</span>
            </button>
            <button 
              className="btn-primary"
              onClick={handlePrint}
            >
              <Printer size={15} />
              <span>Print Evidentiary Report</span>
            </button>
          </div>
        }
      />

      {/* Analytics Charts Grid */}
      <div style={styles.chartsGrid}>
        {/* Chart 1: Monthly Spill Trends */}
        <div className="varuna-card">
          <div className="varuna-card-header">
            <div className="varuna-card-title">
              <TrendingUp size={16} color="var(--accent-primary)" />
              <span>Monthly Spill Frequency & Area (km²)</span>
            </div>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              LAST 6 MONTHS
            </span>
          </div>

          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A3B54" />
                <XAxis dataKey="month" stroke="#647C90" fontSize={10} />
                <YAxis stroke="#647C90" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#102B40', borderColor: '#18B6A4', fontSize: 11 }}
                  itemStyle={{ color: '#F5F8FA' }}
                />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
                <Bar dataKey="incidents" name="Incidents" fill="#18B6A4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalAreaKm2" name="Area (km²)" fill="#3987C9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Incident Severity Breakdown */}
        <div className="varuna-card">
          <div className="varuna-card-header">
            <div className="varuna-card-title">
              <PieIcon size={16} color="var(--status-warning)" />
              <span>Severity Distribution</span>
            </div>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              24 MONITORED CASES
            </span>
          </div>

          <div style={{ width: '100%', height: 210, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ANALYTICS_DATA.severityBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {ANALYTICS_DATA.severityBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#102B40', borderColor: '#18B6A4', fontSize: 11 }}
                  itemStyle={{ color: '#F5F8FA' }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Vessel Type Attribution Risk */}
        <div className="varuna-card">
          <div className="varuna-card-header">
            <div className="varuna-card-title">
              <BarChart3 size={16} color="var(--status-danger)" />
              <span>Attributed Vessel Classes (%)</span>
            </div>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              HISTORICAL CORRELATION
            </span>
          </div>

          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={ANALYTICS_DATA.vesselTypeCorrelation} 
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1A3B54" />
                <XAxis type="number" stroke="#647C90" fontSize={10} />
                <YAxis dataKey="type" type="category" stroke="#647C90" fontSize={9} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#102B40', borderColor: '#18B6A4', fontSize: 11 }}
                  itemStyle={{ color: '#F5F8FA' }}
                />
                <Bar dataKey="percent" name="% of Total Attributions" fill="#E87565" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Investigation Dossier Printable Report View */}
      <div className="varuna-card" style={styles.dossierContainer}>
        <div style={styles.dossierHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={styles.dossierBadge}>
              <img src="/logo.svg" alt="VARUNA Emblem" style={{ width: 36, height: 36 }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1.5, color: '#FFFFFF' }}>
                VARUNA MARITIME INTELLIGENCE DOSSIER
              </div>
              <div style={{ fontSize: 10, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                OFFICIAL REPORT FOR MARITIME LAW ENFORCEMENT & INDIAN COAST GUARD
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--status-warning)' }}>
              CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              CASE REF: {currentIncident.id}
            </div>
          </div>
        </div>

        {/* Dossier Body Content */}
        <div style={styles.dossierBody}>
          {/* Section 1: Incident Summary */}
          <div style={styles.dossierSection}>
            <div style={styles.sectionTitle}>1. INCIDENT OBSERVATION SUMMARY</div>
            <div style={styles.dossierGrid}>
              <div>
                <span style={styles.gridKey}>INCIDENT IDENTIFIER:</span>
                <span style={styles.gridVal}>{currentIncident.id}</span>
              </div>
              <div>
                <span style={styles.gridKey}>GEOGRAPHIC REGION:</span>
                <span style={styles.gridVal}>{currentIncident.location}</span>
              </div>
              <div>
                <span style={styles.gridKey}>OBSERVATION CENTROID:</span>
                <span style={styles.gridValMono}>{currentIncident.coordinates[0]}°N, {currentIncident.coordinates[1]}°E</span>
              </div>
              <div>
                <span style={styles.gridKey}>OIL SLICK EXTENT:</span>
                <span style={styles.gridVal}>{currentIncident.spillArea} km² ({currentIncident.estimatedVolume})</span>
              </div>
              <div>
                <span style={styles.gridKey}>AI DETECTION CONFIDENCE:</span>
                <span style={{ ...styles.gridVal, color: 'var(--accent-primary)', fontWeight: 700 }}>
                  {currentIncident.confidence}% (Deep-SAR Dual-Pol U-Net)
                </span>
              </div>
              <div>
                <span style={styles.gridKey}>INGESTION SCENE:</span>
                <span style={styles.gridValMono}>{satelliteScene.sceneCenter ? satelliteScene.mission : 'Sentinel-1B'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Hydrodynamic Origin Reconstruction */}
          <div style={styles.dossierSection}>
            <div style={styles.sectionTitle}>2. MET-OCEAN BACKWARD DRIFT RECONSTRUCTION</div>
            <div style={styles.dossierGrid}>
              <div>
                <span style={styles.gridKey}>RECONSTRUCTED ORIGIN:</span>
                <span style={{ ...styles.gridValMono, color: 'var(--status-warning)', fontWeight: 700 }}>
                  {environmentalData.reconstructedOrigin.lat}°N, {environmentalData.reconstructedOrigin.lon}°E
                </span>
              </div>
              <div>
                <span style={styles.gridKey}>ESTIMATED TIME WINDOW:</span>
                <span style={styles.gridValMono}>{environmentalData.reconstructedOrigin.estimatedTimeWindow}</span>
              </div>
              <div>
                <span style={styles.gridKey}>ATMOSPHERIC WIND VECTOR:</span>
                <span style={styles.gridVal}>{environmentalData.windSpeedKnots} kn @ {environmentalData.windDirectionDeg}° (NOAA GFS)</span>
              </div>
              <div>
                <span style={styles.gridKey}>OCEAN SURFACE CURRENT:</span>
                <span style={styles.gridVal}>{environmentalData.oceanCurrentSpeedMs} m/s @ {environmentalData.oceanCurrentDirectionDeg}° (HYCOM)</span>
              </div>
              <div>
                <span style={styles.gridKey}>UNCERTAINTY DISPERSION:</span>
                <span style={styles.gridVal}>±{environmentalData.reconstructedOrigin.uncertaintyRadiusKm} km Radius (89% Confidence)</span>
              </div>
              <div>
                <span style={styles.gridKey}>LAGRANGIAN PARTICLES:</span>
                <span style={styles.gridVal}>{environmentalData.particleCount} Tracers / {environmentalData.totalDriftHours} hrs backward</span>
              </div>
            </div>
          </div>

          {/* Section 3: Vessel Attribution Findings */}
          <div style={styles.dossierSection}>
            <div style={styles.sectionTitle}>3. PRIMARY ATTRIBUTED VESSEL OF INTEREST</div>
            <div style={{ backgroundColor: 'rgba(7, 24, 39, 0.6)', padding: '14px 16px', borderRadius: 6, border: '1px solid var(--border-subtle)', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                    {primaryVessel.name}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginLeft: 10 }}>
                    {primaryVessel.id} • Flag: {primaryVessel.flag}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--status-danger)', fontFamily: 'var(--font-mono)' }}>
                    Score: {primaryVessel.suspicionScore}/100
                  </span>
                  <div style={{ fontSize: 10, color: 'var(--status-danger)', fontWeight: 600 }}>
                    {primaryVessel.status}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong>Attribution Evidence & Rationale:</strong>
                <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                  {primaryVessel.anomalyRationale && primaryVessel.anomalyRationale.map((rat, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{rat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: Recommended Enforcement Protocol */}
          <div style={{ ...styles.dossierSection, borderBottom: 'none' }}>
            <div style={styles.sectionTitle}>4. RECOMMENDED INTERCEPTION & LEGAL ACTIONS</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p>
                1. <strong>Coast Guard Interception:</strong> Dispatch Offshore Patrol Vessel (OPV) or Dornier maritime reconnaissance aircraft to current vessel coordinates ({primaryVessel.destination}).
              </p>
              <p>
                2. <strong>Physical Sampling & Fingerprinting:</strong> Inspect slop tank soundings, oily water separator (OWS) oil content monitor (OCM) memory chips, and execute gas chromatography-mass spectrometry (GC-MS) on slick samples.
              </p>
              <p>
                3. <strong>Port State Control Detention:</strong> Issue MARPOL Annex I violation alert to next destination port under United Nations Convention on the Law of the Sea (UNCLOS) Article 217.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 20,
    marginBottom: 24,
  },
  dossierContainer: {
    padding: '24px 28px',
    backgroundColor: '#0A2234',
    border: '1px solid rgba(24, 182, 164, 0.4)',
  },
  dossierHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottom: '2px solid var(--accent-primary)',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  dossierBadge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    background: '#071827',
    border: '1px solid var(--accent-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dossierBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  dossierSection: {
    paddingBottom: 16,
    borderBottom: '1px solid rgba(26, 59, 84, 0.6)',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-primary)',
    letterSpacing: '1px',
    marginBottom: 10,
  },
  dossierGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 12,
  },
  gridKey: {
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    display: 'block',
  },
  gridVal: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  gridValMono: {
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-main)',
  },
};
