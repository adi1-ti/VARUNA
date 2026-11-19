import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Satellite, 
  Cpu, 
  Layers, 
  Eye, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Maximize2,
  RefreshCw,
  Info
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

export default function SatelliteDetection() {
  const { currentIncident, satelliteScene } = useIncident();
  const navigate = useNavigate();

  const [isInferring, setIsInferring] = useState(false);
  const [inferenceComplete, setInferenceComplete] = useState(true);
  const [activeLayer, setActiveLayer] = useState('segmented'); // 'raw', 'segmented', 'composite'
  const [sliderPosition, setSliderPosition] = useState(50); // % for comparison slider

  const handleRunInference = () => {
    setIsInferring(true);
    setInferenceComplete(false);
    setTimeout(() => {
      setIsInferring(false);
      setInferenceComplete(true);
    }, 1200);
  };

  return (
    <div>
      <PageHeader
        title="Satellite SAR Ingestion & AI Segmentation"
        subtitle="Synthetic Aperture Radar (SAR) Bragg scattering suppression analysis via Deep-SAR Dual-Pol U-Net."
        tag="COPERNICUS SENTINEL-1B C-SAR"
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              className="btn-secondary"
              onClick={handleRunInference}
              disabled={isInferring}
            >
              <RefreshCw size={14} className={isInferring ? 'spin' : ''} />
              <span>{isInferring ? 'Inferring U-Net...' : 'Re-Run AI Inference'}</span>
            </button>
            <button 
              className="btn-primary"
              onClick={() => navigate('/origin')}
            >
              <span>Reconstruct Origin</span>
              <ArrowRight size={15} />
            </button>
          </div>
        }
      />

      {/* Sensor & Telemetry Bar */}
      <div style={styles.sensorBar}>
        <div style={styles.sensorMetric}>
          <span style={styles.sensorLabel}>SATELLITE MISSION</span>
          <span style={styles.sensorVal}>{satelliteScene.mission}</span>
        </div>
        <div style={styles.sensorMetric}>
          <span style={styles.sensorLabel}>RADAR INSTRUMENT</span>
          <span style={styles.sensorVal}>{satelliteScene.instrument}</span>
        </div>
        <div style={styles.sensorMetric}>
          <span style={styles.sensorLabel}>POLARIZATION</span>
          <span style={styles.sensorVal}>{satelliteScene.polarization}</span>
        </div>
        <div style={styles.sensorMetric}>
          <span style={styles.sensorLabel}>GROUND RESOLUTION</span>
          <span style={styles.sensorVal}>{satelliteScene.spatialResolution}</span>
        </div>
        <div style={styles.sensorMetric}>
          <span style={styles.sensorLabel}>ACQUISITION TIME</span>
          <span style={styles.sensorValMono}>{new Date(satelliteScene.acquisitionTime).toUTCString()}</span>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div style={styles.mainGrid}>
        {/* Left Column: Interactive SAR Image Viewer */}
        <div className="varuna-card" style={{ gridColumn: 'span 8' }}>
          <div className="varuna-card-header">
            <div className="varuna-card-title">
              <Eye size={17} color="var(--accent-primary)" />
              <span>SAR Backscatter & Mask Analysis</span>
            </div>

            {/* View Layer Selector Buttons */}
            <div style={styles.layerSelector}>
              <button 
                style={{
                  ...styles.layerBtn,
                  backgroundColor: activeLayer === 'raw' ? 'var(--accent-primary)' : 'transparent',
                  color: activeLayer === 'raw' ? '#071827' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveLayer('raw')}
              >
                Raw SAR Backscatter
              </button>
              <button 
                style={{
                  ...styles.layerBtn,
                  backgroundColor: activeLayer === 'segmented' ? 'var(--accent-primary)' : 'transparent',
                  color: activeLayer === 'segmented' ? '#071827' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveLayer('segmented')}
              >
                AI Segmentation Mask
              </button>
              <button 
                style={{
                  ...styles.layerBtn,
                  backgroundColor: activeLayer === 'composite' ? 'var(--accent-primary)' : 'transparent',
                  color: activeLayer === 'composite' ? '#071827' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveLayer('composite')}
              >
                Side-by-Side Slider
              </button>
            </div>
          </div>

          {/* Interactive SVG Radar Canvas */}
          <div style={styles.canvasContainer}>
            {isInferring && (
              <div style={styles.scanningOverlay}>
                <div style={styles.scanBeam} />
                <div style={styles.scanText}>
                  <Cpu size={20} color="var(--accent-primary)" />
                  <span>Processing U-Net Dual-Pol Tensor Convolution...</span>
                </div>
              </div>
            )}

            <svg 
              viewBox="0 0 600 420" 
              style={styles.radarSvg}
            >
              <defs>
                {/* Simulated Speckle Noise Texture for SAR Ocean Surface */}
                <radialGradient id="sarOceanGradient" cx="50%" cy="50%" r="65%">
                  <stop offset="0%" stop-color="#12293b" />
                  <stop offset="60%" stop-color="#0c1f2e" />
                  <stop offset="100%" stop-color="#06131d" />
                </radialGradient>

                {/* Oil Slick Damping Area Gradient */}
                <radialGradient id="oilSlickDamping" cx="45%" cy="45%" r="60%">
                  <stop offset="0%" stop-color="#02090f" stop-opacity="0.95" />
                  <stop offset="70%" stop-color="#06121b" stop-opacity="0.85" />
                  <stop offset="100%" stop-color="#0a1b28" stop-opacity="0.2" />
                </radialGradient>

                {/* AI Mask Glow */}
                <filter id="aiMaskGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Ocean SAR Backscatter Background */}
              <rect x="0" y="0" width="600" height="420" fill="url(#sarOceanGradient)" />

              {/* SAR Grid Overlay */}
              <g stroke="#1b3952" stroke-width="0.75" stroke-dasharray="4 4" opacity="0.6">
                <line x1="100" y1="0" x2="100" y2="420" />
                <line x1="200" y1="0" x2="200" y2="420" />
                <line x1="300" y1="0" x2="300" y2="420" />
                <line x1="400" y1="0" x2="400" y2="420" />
                <line x1="500" y1="0" x2="500" y2="420" />
                <line x1="0" y1="70" x2="600" y2="70" />
                <line x1="0" y1="140" x2="600" y2="140" />
                <line x1="0" y1="210" x2="600" y2="210" />
                <line x1="0" y1="280" x2="600" y2="280" />
                <line x1="0" y1="350" x2="600" y2="350" />
              </g>

              {/* Simulated Oil Slick Path / Damped capillary waves */}
              <path
                d="M 180,240 C 210,210 240,225 280,180 C 320,135 370,140 430,110 C 460,95 440,130 400,165 C 360,200 310,215 260,255 C 220,290 190,270 180,240 Z"
                fill="url(#oilSlickDamping)"
                stroke="#02090f"
                stroke-width="1.5"
              />

              {/* Smaller secondary sheen fragments */}
              <path
                d="M 445,100 C 470,85 490,95 480,115 C 465,125 450,115 445,100 Z"
                fill="url(#oilSlickDamping)"
              />

              {/* Render AI Segmentation Mask if layer is 'segmented' or 'composite' */}
              {(activeLayer === 'segmented' || activeLayer === 'composite') && (
                <g filter="url(#aiMaskGlow)">
                  <path
                    d="M 180,240 C 210,210 240,225 280,180 C 320,135 370,140 430,110 C 460,95 440,130 400,165 C 360,200 310,215 260,255 C 220,290 190,270 180,240 Z"
                    fill="rgba(24, 182, 164, 0.28)"
                    stroke="#18B6A4"
                    stroke-width="2.2"
                    stroke-dasharray="6 3"
                  />
                  {/* Dense Hydrocarbon Core */}
                  <path
                    d="M 230,220 C 255,195 285,190 325,170 C 315,190 280,215 245,235 Z"
                    fill="rgba(232, 117, 101, 0.35)"
                    stroke="#E87565"
                    stroke-width="1.5"
                  />
                  {/* Centroid Crosshairs */}
                  <circle cx="310" cy="180" r="5" fill="#18B6A4" />
                  <circle cx="310" cy="180" r="14" fill="none" stroke="#18B6A4" stroke-width="1" stroke-dasharray="3 3" />
                  <line x1="290" y1="180" x2="330" y2="180" stroke="#18B6A4" stroke-width="1" />
                  <line x1="310" y1="160" x2="310" y2="200" stroke="#18B6A4" stroke-width="1" />
                  <text x="328" y="174" fill="#18B6A4" font-size="11" font-family="JetBrains Mono" font-weight="bold">
                    Slick Centroid ({currentIncident.spillArea} km²)
                  </text>
                  <text x="328" y="190" fill="#A5B8C5" font-size="9" font-family="JetBrains Mono">
                    {currentIncident.coordinates[0]}°N, {currentIncident.coordinates[1]}°E
                  </text>
                </g>
              )}

              {/* Slider Divider for Composite mode */}
              {activeLayer === 'composite' && (
                <g>
                  <line 
                    x1={(sliderPosition / 100) * 600} 
                    y1="0" 
                    x2={(sliderPosition / 100) * 600} 
                    y2="420" 
                    stroke="#F4B942" 
                    stroke-width="2" 
                  />
                  <circle 
                    cx={(sliderPosition / 100) * 600} 
                    cy="210" 
                    r="12" 
                    fill="#102B40" 
                    stroke="#F4B942" 
                    stroke-width="2" 
                  />
                  <text 
                    x={(sliderPosition / 100) * 600 - 8} 
                    y="214" 
                    fill="#F4B942" 
                    font-size="10" 
                    font-family="sans-serif"
                  >
                    ⇄
                  </text>
                </g>
              )}

              {/* HUD Coordinates and Scale */}
              <text x="14" y="24" fill="#647C90" font-size="10" font-family="JetBrains Mono">
                POL: VV+VH | SWATH: IW | INCIDENCE: 38.6° | DAMPING: -7.8 dB
              </text>
              <text x="14" y="405" fill="#647C90" font-size="10" font-family="JetBrains Mono">
                LAT: 19.2045°N | LON: 66.5124°E | SCALE: 1:50,000
              </text>
            </svg>
          </div>

          {/* Slider Control for Composite View */}
          {activeLayer === 'composite' && (
            <div style={styles.sliderControlRow}>
              <Sliders size={15} color="var(--status-warning)" />
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                Backscatter vs U-Net Segmentation Split: {sliderPosition}%
              </span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--status-warning)' }}
              />
            </div>
          )}

          {/* Forensic Notes */}
          <div style={styles.forensicNotes}>
            <Info size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ color: 'var(--text-main)' }}>SAR Physics Verification:</strong>
              <p style={{ marginTop: 2, fontSize: 12, color: 'var(--text-secondary)' }}>
                Oil slicks dampen capillary and short gravity ocean waves, causing high radar specular reflection away from the satellite and producing distinctive low-backscatter dark regions (-7.8 dB delta). 
                Deep-SAR U-Net evaluated dual-polarization ratio VV/VH to eliminate biological look-alikes.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: AI Inference Metrics & Parameter Panel */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* AI Segmentation Result Card */}
          <div className="varuna-card">
            <div className="varuna-card-header">
              <div className="varuna-card-title">
                <Cpu size={16} color="var(--accent-primary)" />
                <span>Segmentation Metrics</span>
              </div>
              <StatusBadge status="Confirmed Slick" size="sm" />
            </div>

            <div style={styles.metricsList}>
              <div style={styles.metricItem}>
                <span style={styles.metricName}>Segmented Area</span>
                <span style={styles.metricValueLarge}>{currentIncident.spillArea} km²</span>
              </div>
              <div style={styles.metricItem}>
                <span style={styles.metricName}>Detection Confidence</span>
                <span style={{ ...styles.metricValueLarge, color: 'var(--accent-primary)' }}>
                  {currentIncident.confidence}%
                </span>
              </div>
              <div style={styles.metricItem}>
                <span style={styles.metricName}>Estimated Volume</span>
                <span style={styles.metricValueMono}>{currentIncident.estimatedVolume}</span>
              </div>
              <div style={styles.metricItem}>
                <span style={styles.metricName}>Backscatter Damping</span>
                <span style={styles.metricValueMono}>-7.8 dB (VV Pol)</span>
              </div>
              <div style={styles.metricItem}>
                <span style={styles.metricName}>Major Axis Length</span>
                <span style={styles.metricValueMono}>14.2 km (Elongated)</span>
              </div>
              <div style={styles.metricItem}>
                <span style={styles.metricName}>Look-Alike Risk</span>
                <span style={{ ...styles.metricValueMono, color: 'var(--accent-primary)' }}>
                  4.0% (Rejected)
                </span>
              </div>
            </div>
          </div>

          {/* Model Specification Card */}
          <div className="varuna-card">
            <div className="varuna-card-header">
              <div className="varuna-card-title">
                <Layers size={16} color="var(--accent-secondary)" />
                <span>Deep-SAR Architecture</span>
              </div>
              <span className="badge badge-blue">v3.2</span>
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10 }}>ARCHITECTURE</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                  ResNet34-Encoder U-Net with Dual-Pol Attention Gates
                </span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10 }}>FALSE-POSITIVE REJECTION</span>
                <span style={{ color: 'var(--text-main)' }}>
                  Automated GFS wind threshold check (14.2 kn &gt; 3.0 m/s limit)
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 10 }}>INFERENCE LATENCY</span>
                <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                  248 ms on GPU TensorRT
                </span>
              </div>
            </div>
          </div>

          {/* Next Phase Action */}
          <div style={styles.nextActionCard}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>
              Next Intelligence Step:
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Trace the slick back to its point of release by coupling GFS atmospheric winds and HYCOM surface current vectors.
            </p>
            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/origin')}
            >
              <span>Launch Origin Reconstruction</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  sensorBar: {
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
  sensorMetric: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  sensorLabel: {
    fontSize: 9.5,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    letterSpacing: '0.6px',
  },
  sensorVal: {
    fontSize: 12.5,
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  sensorValMono: {
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-primary)',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: 20,
  },
  layerSelector: {
    display: 'flex',
    gap: 6,
    backgroundColor: 'rgba(7, 24, 39, 0.7)',
    padding: 3,
    borderRadius: 6,
    border: '1px solid var(--border-subtle)',
  },
  layerBtn: {
    border: 'none',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  canvasContainer: {
    position: 'relative',
    borderRadius: 6,
    overflow: 'hidden',
    border: '1px solid var(--border-subtle)',
    backgroundColor: '#071827',
  },
  radarSvg: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 24, 39, 0.85)',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 12,
  },
  scanBeam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'var(--accent-primary)',
    boxShadow: '0 0 15px var(--accent-primary)',
    animation: 'scanAnimation 1.2s infinite ease-in-out',
  },
  scanText: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: 'var(--accent-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    fontWeight: 600,
  },
  sliderControlRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    padding: '8px 12px',
    backgroundColor: 'rgba(7, 24, 39, 0.5)',
    borderRadius: 4,
    border: '1px solid var(--border-subtle)',
  },
  forensicNotes: {
    display: 'flex',
    gap: 12,
    marginTop: 16,
    padding: '12px 14px',
    backgroundColor: 'rgba(24, 182, 164, 0.08)',
    border: '1px solid rgba(24, 182, 164, 0.25)',
    borderRadius: 6,
  },
  metricsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  metricItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottom: '1px solid rgba(26, 59, 84, 0.4)',
  },
  metricName: {
    fontSize: 12,
    color: 'var(--text-secondary)',
  },
  metricValueLarge: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    color: 'var(--text-main)',
  },
  metricValueMono: {
    fontSize: 13,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-main)',
  },
  nextActionCard: {
    backgroundColor: 'rgba(16, 43, 64, 0.8)',
    border: '1px solid var(--accent-primary)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    boxShadow: '0 0 20px rgba(24, 182, 164, 0.15)',
  },
};
