import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Wind, 
  Waves, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  MapPin,
  HelpCircle,
  Sliders
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

export default function OriginReconstruction() {
  const { currentIncident, environmentalData } = useIncident();
  const navigate = useNavigate();

  const waypoints = environmentalData.trajectoryWaypoints || [];
  const maxStep = waypoints.length - 1;

  const [currentStep, setCurrentStep] = useState(maxStep); // default solved at origin
  const [isPlaying, setIsPlaying] = useState(false);
  const [leewayFactor, setLeewayFactor] = useState(3.1); // %

  // Animation timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= maxStep) {
            setIsPlaying(false);
            return maxStep;
          }
          return prev + 1;
        });
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isPlaying, maxStep]);

  const activeWaypoint = waypoints[currentStep] || waypoints[0];

  const handlePlayFromStart = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <div>
      <PageHeader
        title="Backward Hydrodynamic Drift & Origin Modeling"
        subtitle="Reverse Lagrangian particle dispersion simulation forced by met-ocean wind and ocean currents."
        tag="OPENDRIFT / OPENOIL FORMULATION"
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              className="btn-secondary"
              onClick={() => {
                if (isPlaying) setIsPlaying(false);
                else if (currentStep >= maxStep) handlePlayFromStart();
                else setIsPlaying(true);
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause Drift' : currentStep >= maxStep ? 'Replay Drift' : 'Play Drift'}</span>
            </button>
            <button 
              className="btn-primary"
              onClick={() => navigate('/vessels')}
            >
              <span>Attribute Vessels</span>
              <ArrowRight size={15} />
            </button>
          </div>
        }
      />

      {/* Met-Ocean Forcing Parameters Bar */}
      <div style={styles.envBar}>
        <div style={styles.envMetric}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Wind size={15} color="var(--accent-primary)" />
            <span style={styles.envLabel}>ATMOSPHERIC WIND (GFS)</span>
          </div>
          <span style={styles.envVal}>
            {environmentalData.windSpeedKnots} kn @ {environmentalData.windDirectionDeg}° (WNW)
          </span>
        </div>

        <div style={styles.envMetric}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Waves size={15} color="var(--accent-secondary)" />
            <span style={styles.envLabel}>OCEAN SURFACE CURRENT (HYCOM)</span>
          </div>
          <span style={styles.envVal}>
            {environmentalData.oceanCurrentSpeedMs} m/s @ {environmentalData.oceanCurrentDirectionDeg}° (SE)
          </span>
        </div>

        <div style={styles.envMetric}>
          <span style={styles.envLabel}>OIL LEEWAY FACTOR</span>
          <span style={styles.envValMono}>{leewayFactor}% surface windage</span>
        </div>

        <div style={styles.envMetric}>
          <span style={styles.envLabel}>DRIFT TIME WINDOW</span>
          <span style={styles.envValMono}>{environmentalData.totalDriftHours} Hours Backward</span>
        </div>

        <div style={styles.envMetric}>
          <span style={styles.envLabel}>ORIGIN CONFIDENCE</span>
          <span style={{ ...styles.envValMono, color: 'var(--accent-primary)', fontWeight: 700 }}>
            {environmentalData.reconstructedOrigin.confidenceScore}% (High)
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Trajectory Canvas & Solved Origin */}
      <div style={styles.mainGrid}>
        {/* Left Column: Drift Simulation Map Canvas */}
        <div className="varuna-card" style={{ gridColumn: 'span 8' }}>
          <div className="varuna-card-header">
            <div className="varuna-card-title">
              <Compass size={17} color="var(--accent-primary)" />
              <span>Lagrangian Backward Trajectory Vector Plot</span>
            </div>
            
            {/* Playback Controls */}
            <div style={styles.controlsRow}>
              <button 
                onClick={handlePlayFromStart}
                style={styles.iconBtn}
                title="Reset to T=0 Detection"
              >
                <RotateCcw size={13} />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                style={{ ...styles.iconBtn, backgroundColor: 'var(--accent-primary)', color: '#071827' }}
                title={isPlaying ? 'Pause' : 'Play Simulation'}
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              </button>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                Step {currentStep} / {maxStep} ({activeWaypoint.time})
              </span>
            </div>
          </div>

          {/* Canvas SVG */}
          <div style={styles.canvasContainer}>
            <svg viewBox="0 0 700 440" style={styles.driftSvg}>
              <defs>
                <radialGradient id="oceanBg" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stop-color="#0E2333" />
                  <stop offset="100%" stop-color="#071827" />
                </radialGradient>
                <radialGradient id="originGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#F4B942" stop-opacity="0.4" />
                  <stop offset="100%" stop-color="#F4B942" stop-opacity="0" />
                </radialGradient>
              </defs>

              <rect width="700" height="440" fill="url(#oceanBg)" />

              {/* Bathymetry & Coordinates Grid */}
              <g stroke="#16344B" stroke-width="0.8" stroke-dasharray="4 4" opacity="0.6">
                <line x1="140" y1="0" x2="140" y2="440" />
                <line x1="280" y1="0" x2="280" y2="440" />
                <line x1="420" y1="0" x2="420" y2="440" />
                <line x1="560" y1="0" x2="560" y2="440" />
                <line x1="0" y1="110" x2="700" y2="110" />
                <line x1="0" y1="220" x2="700" y2="220" />
                <line x1="0" y1="330" x2="700" y2="330" />
              </g>

              {/* Environmental Forcing Vector Indicators */}
              <g transform="translate(60, 60)">
                <circle cx="0" cy="0" r="32" fill="rgba(16, 43, 64, 0.7)" stroke="#1A3B54" />
                {/* Wind Vector */}
                <line x1="0" y1="0" x2="24" y2="10" stroke="#18B6A4" stroke-width="2.5" stroke-linecap="round" />
                <polygon points="26,11 20,6 21,15" fill="#18B6A4" />
                <text x="32" y="14" fill="#18B6A4" font-size="9" font-family="JetBrains Mono">
                  Wind 14.2 kn (WNW)
                </text>
                {/* Current Vector */}
                <line x1="0" y1="0" x2="14" y2="20" stroke="#3987C9" stroke-width="2" stroke-linecap="round" />
                <polygon points="16,22 10,18 17,14" fill="#3987C9" />
                <text x="22" y="32" fill="#3987C9" font-size="9" font-family="JetBrains Mono">
                  Current 0.65 m/s (SE)
                </text>
              </g>

              {/* Reconstructed Origin Uncertainty Ellipse */}
              <ellipse 
                cx="190" 
                cy="140" 
                rx="65" 
                ry="45" 
                fill="url(#originGlow)" 
                stroke="#F4B942" 
                stroke-width="1.8" 
                stroke-dasharray="6 3" 
              />
              <circle cx="190" cy="140" r="6" fill="#F4B942" />
              <circle cx="190" cy="140" r="14" fill="none" stroke="#F4B942" stroke-width="1" stroke-dasharray="3 3" />
              <text x="204" y="135" fill="#F4B942" font-size="12" font-family="JetBrains Mono" font-weight="bold">
                PROBABLE DISCHARGE ORIGIN
              </text>
              <text x="204" y="152" fill="#A5B8C5" font-size="10" font-family="JetBrains Mono">
                {environmentalData.reconstructedOrigin.lat}°N, {environmentalData.reconstructedOrigin.lon}°E (±3.2 km)
              </text>

              {/* Trajectory Polyline connecting waypoints */}
              <path
                d="M 520,310 C 470,280 430,250 380,225 C 330,200 270,175 190,140"
                fill="none"
                stroke="#18B6A4"
                stroke-width="2.8"
                stroke-dasharray="7 4"
              />

              {/* Render Animated Trajectory Waypoints up to currentStep */}
              {waypoints.slice(0, currentStep + 1).map((wp, index) => {
                // Approximate parametric coordinates along curve
                const progress = index / maxStep;
                const x = 520 - progress * (520 - 190);
                const y = 310 - progress * (310 - 140) + Math.sin(progress * Math.PI) * 15;
                const isSelected = index === currentStep;

                return (
                  <g key={wp.step} transform={`translate(${x}, ${y})`}>
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={isSelected ? 8 : 4.5} 
                      fill={index === 0 ? '#E87565' : index === maxStep ? '#F4B942' : '#18B6A4'} 
                      stroke="#071827"
                      stroke-width="2"
                    />
                    {isSelected && (
                      <circle 
                        cx="0" 
                        cy="0" 
                        r="14" 
                        fill="none" 
                        stroke="#18B6A4" 
                        stroke-width="1.5" 
                        stroke-dasharray="3 2" 
                      />
                    )}
                    <text 
                      x="10" 
                      y="-8" 
                      fill={isSelected ? '#F5F8FA' : '#647C90'} 
                      font-size={isSelected ? "11" : "9"} 
                      font-family="JetBrains Mono"
                      font-weight={isSelected ? "bold" : "normal"}
                    >
                      T-{index}h ({wp.lat.toFixed(2)}°N)
                    </text>
                  </g>
                );
              })}

              {/* Observed Oil Slick Boundary at T=0 */}
              <g transform="translate(520, 310)">
                <ellipse cx="0" cy="0" rx="35" ry="18" fill="rgba(232, 117, 101, 0.3)" stroke="#E87565" stroke-width="2" />
                <circle cx="0" cy="0" r="4" fill="#E87565" />
                <text x="10" y="28" fill="#E87565" font-size="11" font-family="JetBrains Mono" font-weight="bold">
                  Observed Slick (T=0)
                </text>
              </g>

              {/* Bottom HUD */}
              <text x="14" y="420" fill="#647C90" font-size="10" font-family="JetBrains Mono">
                LAT: 19.3412°N | LON: 66.3218°E | SPREADING VELOCITY: 1.42 kn | PARTICLES: 5000
              </text>
            </svg>
          </div>

          {/* Timeline Scrubber */}
          <div style={styles.scrubberContainer}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                Backward Time-Step Scrubber (Hour 0 to Hour {environmentalData.totalDriftHours})
              </span>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 600 }}>
                {activeWaypoint.time}
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max={maxStep}
              value={currentStep}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentStep(Number(e.target.value));
              }}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <div style={styles.scrubberLabels}>
              <span>T=0 (Slick Observed)</span>
              <span>T-3h (Midpoint)</span>
              <span style={{ color: 'var(--status-warning)' }}>T-6.5h (Discharge Inception)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Reconstructed Origin Dossier */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Solved Origin Summary Card */}
          <div className="varuna-card">
            <div className="varuna-card-header">
              <div className="varuna-card-title">
                <MapPin size={16} color="var(--status-warning)" />
                <span>Solved Release Origin</span>
              </div>
              <StatusBadge status="Origin Converged" size="sm" />
            </div>

            <div style={styles.originDossier}>
              <div style={styles.dossierRow}>
                <span style={styles.dossierKey}>Origin Centroid</span>
                <span style={styles.dossierValHighlight}>
                  {environmentalData.reconstructedOrigin.lat}°N, {environmentalData.reconstructedOrigin.lon}°E
                </span>
              </div>
              <div style={styles.dossierRow}>
                <span style={styles.dossierKey}>Estimated Source Window</span>
                <span style={{ ...styles.dossierVal, fontSize: 11, color: 'var(--status-warning)' }}>
                  {environmentalData.reconstructedOrigin.estimatedTimeWindow}
                </span>
              </div>
              <div style={styles.dossierRow}>
                <span style={styles.dossierKey}>Uncertainty Ellipse</span>
                <span style={styles.dossierVal}>±{environmentalData.reconstructedOrigin.uncertaintyRadiusKm} km Radius</span>
              </div>
              <div style={styles.dossierRow}>
                <span style={styles.dossierKey}>Net Drift Velocity</span>
                <span style={styles.dossierVal}>{environmentalData.reconstructedOrigin.centroidSpeed}</span>
              </div>
              <div style={styles.dossierRow}>
                <span style={styles.dossierKey}>Backward Particles</span>
                <span style={styles.dossierVal}>{environmentalData.particleCount} Lagrangian Tracers</span>
              </div>
              <div style={styles.dossierRow}>
                <span style={styles.dossierKey}>Model Convergence</span>
                <span style={{ ...styles.dossierVal, color: 'var(--accent-primary)', fontWeight: 700 }}>
                  {environmentalData.reconstructedOrigin.confidenceScore}% (High)
                </span>
              </div>
            </div>
          </div>

          {/* Methodology Explanation */}
          <div className="varuna-card">
            <div className="varuna-card-header">
              <div className="varuna-card-title">
                <HelpCircle size={15} color="var(--accent-secondary)" />
                <span>Drift Physics Formulation</span>
              </div>
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p style={{ marginBottom: 10 }}>
                Eulerian velocity integration combines ocean surface current vectors and windage leeway:
              </p>
              <div style={styles.formulaBox}>
                <code>V_oil = V_current + (0.031 × V_wind)</code>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Where empirical wind leeway factor is 3.1% with 15° Coriolis deflection. By inverting time integration step-by-step (t → -t), the Lagrangian dispersion engine traces the oil plume backwards to maritime shipping coordinates.
              </p>
            </div>
          </div>

          {/* Action to Vessel Attribution */}
          <div style={styles.nextActionCard}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>
              Next Step: Vessel Attribution
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Correlate AIS transponder telemetry against the solved origin coordinates and source time window.
            </p>
            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/vessels')}
            >
              <span>Rank Candidate Vessels</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  envBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 20px',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  envMetric: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  envLabel: {
    fontSize: 9.5,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    letterSpacing: '0.6px',
  },
  envVal: {
    fontSize: 12.5,
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  envValMono: {
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-main)',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: 20,
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    backgroundColor: 'rgba(7, 24, 39, 0.7)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-main)',
    width: 28,
    height: 28,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  canvasContainer: {
    borderRadius: 6,
    overflow: 'hidden',
    border: '1px solid var(--border-subtle)',
    backgroundColor: '#071827',
  },
  driftSvg: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  scrubberContainer: {
    marginTop: 14,
    padding: '10px 14px',
    backgroundColor: 'rgba(7, 24, 39, 0.5)',
    borderRadius: 6,
    border: '1px solid var(--border-subtle)',
  },
  scrubberLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    marginTop: 4,
  },
  originDossier: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  dossierRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottom: '1px solid rgba(26, 59, 84, 0.4)',
  },
  dossierKey: {
    fontSize: 12,
    color: 'var(--text-secondary)',
  },
  dossierValHighlight: {
    fontSize: 13,
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--status-warning)',
  },
  dossierVal: {
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-main)',
  },
  formulaBox: {
    padding: '8px 12px',
    backgroundColor: 'rgba(7, 24, 39, 0.8)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 4,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--accent-primary)',
    margin: '6px 0 10px',
  },
  nextActionCard: {
    backgroundColor: 'rgba(16, 43, 64, 0.8)',
    border: '1px solid var(--status-warning)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    boxShadow: '0 0 20px rgba(244, 185, 66, 0.15)',
  },
};
