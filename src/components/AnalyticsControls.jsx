import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Sliders, 
  Filter, 
  Maximize2, 
  Settings, 
  Radio, 
  ChevronsRight, 
  ChevronsLeft 
} from 'lucide-react';

export default function AnalyticsControls({ 
  filters, 
  setFilters, 
  isOpen, 
  setIsOpen 
}) {
  const [sectionOpen, setSectionOpen] = useState({
    vesselDetection: true,
    aisIntegration: true,
    dataFusion: true,
  });

  const toggleSection = (sectionKey) => {
    setSectionOpen(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const handleToggle = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Left Icon Dock */}
      <div className="left-icon-dock">
        <button 
          className="dock-btn"
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? "Collapse Controls" : "Expand Controls"}
        >
          {isOpen ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
        </button>
        <button className="dock-btn active" title="Surveillance Layers">
          <Layers size={16} />
        </button>
        <button className="dock-btn" title="Analytics Filters">
          <Sliders size={16} />
        </button>
        <button className="dock-btn" title="Sensor Settings">
          <Settings size={16} />
        </button>
      </div>

      {/* Floating Controls Panel */}
      {isOpen && (
        <aside className="analytics-controls-panel">
          <div className="panel-header">
            <span>ANALYTICS CONTROLS</span>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <ChevronsLeft size={14} />
            </button>
          </div>

          <div className="panel-body-scrollable">
            {/* 1. VESSEL DETECTION */}
            <div className="control-accordion-section">
              <div 
                className="accordion-header"
                onClick={() => toggleSection('vesselDetection')}
              >
                <span>VESSEL DETECTION</span>
                {sectionOpen.vesselDetection ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </div>

              {sectionOpen.vesselDetection && (
                <div>
                  {/* Confidence Slider */}
                  <div className="tactical-slider-container">
                    <div className="tactical-slider-header">
                      <span>CONFIDENCE THRESHOLD:</span>
                      <span className="tactical-slider-val">{filters.confidenceThreshold.toFixed(2)}</span>
                    </div>
                    <input 
                      type="range"
                      min="0.5"
                      max="0.99"
                      step="0.01"
                      value={filters.confidenceThreshold}
                      onChange={(e) => setFilters(prev => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }))}
                      className="tactical-slider"
                    />
                  </div>

                  {/* Show Bounding Boxes */}
                  <div className="control-row">
                    <span className="control-label-bold">SHOW BOUNDING BOXES</span>
                    <label className="tactical-switch">
                      <input 
                        type="checkbox" 
                        checked={filters.showBoundingBoxes}
                        onChange={() => handleToggle('showBoundingBoxes')}
                      />
                      <span className="switch-slider switch-slider-blue" />
                    </label>
                  </div>

                  {/* Show Trajectories */}
                  <div className="control-row">
                    <span className="control-label-bold">SHOW TRAJECTORIES</span>
                    <label className="tactical-switch">
                      <input 
                        type="checkbox" 
                        checked={filters.showTrajectories}
                        onChange={() => handleToggle('showTrajectories')}
                      />
                      <span className="switch-slider switch-slider-blue" />
                    </label>
                  </div>

                  {/* Detection Model Dropdown */}
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      DETECTION MODEL
                    </span>
                    <select 
                      className="tactical-select"
                      value={filters.detectionModel}
                      onChange={(e) => setFilters(prev => ({ ...prev, detectionModel: e.target.value }))}
                    >
                      <option value="MULTI-MODAL OPTICAL/SAR">MULTI-MODAL OPTICAL/SAR</option>
                      <option value="SENTINEL-1 C-SAR DUAL-POL">SENTINEL-1 C-SAR DUAL-POL</option>
                      <option value="SPOTLIGHT HIGH-RES 0.5M">SPOTLIGHT HIGH-RES 0.5M</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 2. AIS & RF INTEGRATION */}
            <div className="control-accordion-section">
              <div 
                className="accordion-header"
                onClick={() => toggleSection('aisIntegration')}
              >
                <span>AIS & RF INTEGRATION</span>
                {sectionOpen.aisIntegration ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </div>

              {sectionOpen.aisIntegration && (
                <div>
                  {/* Matched AIS Vessels (Green) */}
                  <div className="control-row">
                    <span className="control-label-bold">MATCHED AIS VESSELS</span>
                    <label className="tactical-switch">
                      <input 
                        type="checkbox" 
                        checked={filters.matchedAisVessels}
                        onChange={() => handleToggle('matchedAisVessels')}
                      />
                      <span className="switch-slider switch-slider-green" />
                    </label>
                  </div>

                  {/* Unmatched Vessels / Dark Targets (Orange) */}
                  <div className="control-row">
                    <span className="control-label-bold" style={{ color: 'var(--accent-orange)' }}>
                      UNMATCHED VESSELS (DARK TARGETS)
                    </span>
                    <label className="tactical-switch">
                      <input 
                        type="checkbox" 
                        checked={filters.unmatchedVessels}
                        onChange={() => handleToggle('unmatchedVessels')}
                      />
                      <span className="switch-slider switch-slider-orange" />
                    </label>
                  </div>

                  {/* RF Signal Correlation */}
                  <div className="control-row">
                    <span className="control-label-bold">RF SIGNAL CORRELATION</span>
                    <label className="tactical-switch">
                      <input 
                        type="checkbox" 
                        checked={filters.rfSignalCorrelation}
                        onChange={() => handleToggle('rfSignalCorrelation')}
                      />
                      <span className="switch-slider switch-slider-blue" />
                    </label>
                  </div>

                  {/* Time Window Slider */}
                  <div className="tactical-slider-container" style={{ marginTop: 10 }}>
                    <div className="tactical-slider-header">
                      <span>TIME WINDOW</span>
                      <span className="tactical-slider-val">LAST 24 HOURS</span>
                    </div>
                    <input 
                      type="range"
                      min="1"
                      max="48"
                      value={filters.timeWindowHours}
                      onChange={(e) => setFilters(prev => ({ ...prev, timeWindowHours: parseInt(e.target.value) }))}
                      className="tactical-slider"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 3 }}>
                      <span>START 21:15:46 UTC</span>
                      <span>END 23:10:45 UTC</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. DATA FUSION */}
            <div className="control-accordion-section">
              <div 
                className="accordion-header"
                onClick={() => toggleSection('dataFusion')}
              >
                <span>DATA FUSION</span>
                {sectionOpen.dataFusion ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </div>

              {sectionOpen.dataFusion && (
                <div>
                  <div className="control-row">
                    <span className="control-label-bold">SATELLITE IMAGERY (OPTICAL)</span>
                    <label className="tactical-switch">
                      <input 
                        type="checkbox" 
                        checked={filters.satelliteOptical}
                        onChange={() => handleToggle('satelliteOptical')}
                      />
                      <span className="switch-slider switch-slider-blue" />
                    </label>
                  </div>

                  <div className="control-row">
                    <span className="control-label-bold">SYNTHETIC APERTURE RADAR (SAR)</span>
                    <label className="tactical-switch">
                      <input 
                        type="checkbox" 
                        checked={filters.syntheticRadar}
                        onChange={() => handleToggle('syntheticRadar')}
                      />
                      <span className="switch-slider switch-slider-blue" />
                    </label>
                  </div>

                  <div className="control-row">
                    <span className="control-label-bold">AUTOMATIC IDENTIFICATION SYSTEM (AIS)</span>
                    <label className="tactical-switch">
                      <input 
                        type="checkbox" 
                        checked={filters.automaticIdentification}
                        onChange={() => handleToggle('automaticIdentification')}
                      />
                      <span className="switch-slider switch-slider-blue" />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Apply Filters Button */}
            <button className="btn-apply-filters">
              APPLY FILTERS
            </button>
          </div>

          <div className="panel-footer-status">
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--accent-green)', boxShadow: '0 0 6px var(--accent-green)' }} />
            <span>LIVE DATA STREAM: CONNECTED</span>
          </div>
        </aside>
      )}
    </>
  );
}
