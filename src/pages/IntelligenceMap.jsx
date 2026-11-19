import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polyline, 
  Polygon, 
  Circle,
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Layers, 
  Ship, 
  Compass, 
  Eye, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

// Helper component to center map smoothly on incident change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Custom Leaflet Icons using SVG DivIcons
const createCustomIcon = (color, label, pulse = false) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
      ">
        ${pulse ? `<div style="
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${color};
          opacity: 0.4;
          animation: pulse 1.8s infinite;
        "></div>` : ''}
        <div style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #071827;
          border: 2px solid ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px ${color};
        ">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const createShipIcon = (color, isSuspect = false) => {
  return L.divIcon({
    className: 'custom-ship-icon',
    html: `
      <div style="
        background: #071827;
        border: 2px solid ${color};
        border-radius: 4px;
        padding: 2px 6px;
        color: ${color};
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 0 12px ${color};
        white-space: nowrap;
      ">
        <span>▲</span>
        <span>${isSuspect ? 'SUSPECT' : 'AIS'}</span>
      </div>
    `,
    iconSize: [60, 24],
    iconAnchor: [30, 12],
    popupAnchor: [0, -14],
  });
};

export default function IntelligenceMap() {
  const { currentIncident, environmentalData, vessels, satelliteScene } = useIncident();

  // Layer Visibility Toggles
  const [layers, setLayers] = useState({
    spillPolygon: true,
    driftTrajectory: true,
    originUncertainty: true,
    vesselPositions: true,
    vesselTracks: true,
  });

  const [selectedEntity, setSelectedEntity] = useState(null);

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const centerCoords = currentIncident.coordinates;
  const originCoords = currentIncident.probableOrigin;
  const waypoints = environmentalData.trajectoryWaypoints || [];

  // Trajectory points array [ [lat, lon], ... ]
  const driftPolyline = waypoints.map(wp => [wp.lat, wp.lon]);

  return (
    <div>
      <PageHeader
        title="GIS Geospatial Intelligence Map"
        subtitle="Multi-layer operational maritime domain awareness: SAR spill extent, backward drift trajectory, and AIS tracks."
        tag="INTEGRATED GIS COP"
      />

      {/* Map Control / Layer Toggles Toolbar */}
      <div style={styles.toolbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            GEOINT LAYERS:
          </span>
        </div>

        <div style={styles.layerPills}>
          <button 
            style={{ ...styles.pillBtn, backgroundColor: layers.spillPolygon ? 'rgba(232, 117, 101, 0.2)' : 'transparent', borderColor: layers.spillPolygon ? 'var(--status-danger)' : 'var(--border-subtle)', color: layers.spillPolygon ? 'var(--status-danger)' : 'var(--text-muted)' }}
            onClick={() => toggleLayer('spillPolygon')}
          >
            Spill Extent ({currentIncident.spillArea} km²)
          </button>

          <button 
            style={{ ...styles.pillBtn, backgroundColor: layers.driftTrajectory ? 'rgba(24, 182, 164, 0.2)' : 'transparent', borderColor: layers.driftTrajectory ? 'var(--accent-primary)' : 'var(--border-subtle)', color: layers.driftTrajectory ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            onClick={() => toggleLayer('driftTrajectory')}
          >
            Backward Drift Path
          </button>

          <button 
            style={{ ...styles.pillBtn, backgroundColor: layers.originUncertainty ? 'rgba(244, 185, 66, 0.2)' : 'transparent', borderColor: layers.originUncertainty ? 'var(--status-warning)' : 'var(--border-subtle)', color: layers.originUncertainty ? 'var(--status-warning)' : 'var(--text-muted)' }}
            onClick={() => toggleLayer('originUncertainty')}
          >
            Probable Origin (±3.2 km)
          </button>

          <button 
            style={{ ...styles.pillBtn, backgroundColor: layers.vesselPositions ? 'rgba(57, 135, 201, 0.2)' : 'transparent', borderColor: layers.vesselPositions ? 'var(--accent-secondary)' : 'var(--border-subtle)', color: layers.vesselPositions ? 'var(--accent-secondary)' : 'var(--text-muted)' }}
            onClick={() => toggleLayer('vesselPositions')}
          >
            AIS Vessels ({vessels.length})
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div style={styles.mapWrapper}>
        <MapContainer
          center={centerCoords}
          zoom={10}
          style={{ width: '100%', height: '560px', borderRadius: 8 }}
          scrollWheelZoom={true}
        >
          <ChangeView center={centerCoords} zoom={10} />

          {/* Free High-Contrast Maritime Basemap (OpenStreetMap with Command Center Dark Filter) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            className="maritime-dark-tiles"
          />

          {/* 1. Oil Spill Polygon & Centroid Marker */}
          {layers.spillPolygon && (
            <>
              {satelliteScene.spillPolygon && (
                <Polygon
                  positions={satelliteScene.spillPolygon}
                  pathOptions={{
                    color: '#E87565',
                    fillColor: '#E87565',
                    fillOpacity: 0.35,
                    weight: 2,
                    dashArray: '4, 4'
                  }}
                />
              )}
              <Marker 
                position={centerCoords}
                icon={createCustomIcon('#E87565', 'Observed Slick', true)}
              >
                <Popup>
                  <div style={{ padding: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 'bold', color: '#E87565', marginBottom: 4 }}>
                      Observed Spill Centroid (T=0)
                    </div>
                    <div style={{ fontSize: 11, color: '#A5B8C5', lineHeight: 1.5 }}>
                      <strong>Incident:</strong> {currentIncident.id}<br />
                      <strong>Area:</strong> {currentIncident.spillArea} km²<br />
                      <strong>Confidence:</strong> {currentIncident.confidence}%<br />
                      <strong>Sensor:</strong> {satelliteScene.mission}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* 2. Backward Drift Trajectory Vector Polyline */}
          {layers.driftTrajectory && (
            <Polyline
              positions={driftPolyline}
              pathOptions={{
                color: '#18B6A4',
                weight: 3,
                dashArray: '6, 6',
                opacity: 0.85
              }}
            />
          )}

          {/* 3. Probable Origin Marker & Uncertainty Ellipse */}
          {layers.originUncertainty && (
            <>
              <Circle
                center={originCoords}
                radius={3200} // 3.2 km in meters
                pathOptions={{
                  color: '#F4B942',
                  fillColor: '#F4B942',
                  fillOpacity: 0.2,
                  weight: 1.5,
                  dashArray: '5, 5'
                }}
              />
              <Marker
                position={originCoords}
                icon={createCustomIcon('#F4B942', 'Probable Origin', true)}
              >
                <Popup>
                  <div style={{ padding: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 'bold', color: '#F4B942', marginBottom: 4 }}>
                      Reconstructed Release Origin
                    </div>
                    <div style={{ fontSize: 11, color: '#A5B8C5', lineHeight: 1.5 }}>
                      <strong>Coordinates:</strong> {originCoords[0]}°N, {originCoords[1]}°E<br />
                      <strong>Time Window:</strong> {environmentalData.reconstructedOrigin.estimatedTimeWindow}<br />
                      <strong>Uncertainty:</strong> ±3.2 km Radius<br />
                      <strong>Origin Confidence:</strong> {environmentalData.reconstructedOrigin.confidenceScore}%
                    </div>
                  </div>
                </Popup>
              </Marker>
            </>
          )}

          {/* 4. Candidate Vessels AIS Markers & Tracks */}
          {layers.vesselPositions && vessels.map((vessel, idx) => {
            const isSuspect = vessel.suspicionScore >= 80;
            const primaryTrack = vessel.aisTrajectory || [];
            const trackPoints = primaryTrack.map(pt => [pt.lat, pt.lon]);
            const currentPos = trackPoints[Math.floor(trackPoints.length / 2)] || originCoords;

            return (
              <React.Fragment key={vessel.id}>
                {/* AIS Track Line */}
                {layers.vesselTracks && trackPoints.length > 0 && (
                  <Polyline
                    positions={trackPoints}
                    pathOptions={{
                      color: isSuspect ? '#E87565' : '#3987C9',
                      weight: isSuspect ? 2.5 : 1.5,
                      dashArray: vessel.aisStatus.includes('Gap') ? '3, 6' : null,
                      opacity: 0.7
                    }}
                  />
                )}

                {/* Vessel Marker */}
                <Marker
                  position={currentPos}
                  icon={createShipIcon(isSuspect ? '#E87565' : '#3987C9', isSuspect)}
                >
                  <Popup>
                    <div style={{ padding: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 'bold', color: isSuspect ? '#E87565' : '#F5F8FA', marginBottom: 4 }}>
                        {vessel.name} ({vessel.id})
                      </div>
                      <div style={{ fontSize: 11, color: '#A5B8C5', lineHeight: 1.5 }}>
                        <strong>Type:</strong> {vessel.type}<br />
                        <strong>Suspicion Score:</strong> {vessel.suspicionScore}/100<br />
                        <strong>Distance to Origin:</strong> {vessel.distanceToOrigin} km<br />
                        <strong>AIS Anomaly:</strong> {vessel.aisStatus}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend Overlay */}
        <div style={styles.mapLegend}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 700 }}>
            TACTICAL MAP SYMBOLS
          </div>
          <div style={styles.legendItem}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#E87565' }} />
            <span>Observed Spill Centroid (T=0)</span>
          </div>
          <div style={styles.legendItem}>
            <span style={{ width: 14, height: 2, backgroundColor: '#18B6A4', borderTop: '2px dashed #18B6A4' }} />
            <span>Backward Met-Ocean Drift</span>
          </div>
          <div style={styles.legendItem}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F4B942' }} />
            <span>Probable Origin Centroid (±3.2 km)</span>
          </div>
          <div style={styles.legendItem}>
            <span style={{ width: 14, height: 2, backgroundColor: '#E87565', borderTop: '2px dashed #E87565' }} />
            <span>Suspect Vessel Track (AIS Gap)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 18px',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  layerPills: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  pillBtn: {
    border: '1px solid',
    borderRadius: 4,
    padding: '4px 10px',
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  mapWrapper: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid var(--border-subtle)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
  mapLegend: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(11, 32, 48, 0.9)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 6,
    padding: '10px 14px',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 11,
    color: 'var(--text-secondary)',
    marginBottom: 4,
  },
};
