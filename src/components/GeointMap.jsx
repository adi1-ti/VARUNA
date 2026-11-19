import React, { useEffect, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  Polyline, 
  Marker, 
  Circle,
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { useIncident } from '../context/IncidentContext';

// Center updater
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Tactical SVG Markers
const createTacticalLabelIcon = (text, type = 'green') => {
  const isOrange = type === 'orange';
  const borderColor = isOrange ? '#f97316' : '#22c55e';
  const bgColor = isOrange ? 'rgba(249, 115, 22, 0.2)' : 'rgba(34, 197, 94, 0.2)';
  const textColor = isOrange ? '#fdba74' : '#86efac';

  return L.divIcon({
    className: 'tactical-div-icon',
    html: `
      <div style="
        background: #07131e;
        border: 1px solid ${borderColor};
        border-radius: 3px;
        padding: 2px 7px;
        color: ${textColor};
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.8);
        white-space: nowrap;
      ">
        <span style="color: ${borderColor}; font-size: 8px;">▲</span>
        <span>${text}</span>
      </div>
    `,
    iconSize: [120, 20],
    iconAnchor: [60, 10],
  });
};

// Target vessel icon with white hull and pulse
const createTargetShipIcon = () => {
  return L.divIcon({
    className: 'target-ship-icon',
    html: `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <!-- Pulsing radar ring -->
        <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; border: 1.5px dashed #f97316; opacity: 0.6; animation: spin 8s linear infinite;"></div>
        <!-- White Vessel Silhouette -->
        <div style="
          width: 24px;
          height: 10px;
          background: #ffffff;
          border-radius: 5px 2px 2px 5px;
          box-shadow: 0 0 12px #38bdf8;
          transform: rotate(-35deg);
        "></div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

export default function GeointMap({ 
  filters, 
  currentMode, 
  onSelectTarget, 
  selectedTarget 
}) {
  const { currentIncident, environmentalData, satelliteScene, vessels } = useIncident();

  const [dimensions, setDimensions] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1440,
    h: typeof window !== 'undefined' ? window.innerHeight : 900
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const centerCoords = currentIncident.coordinates;
  const originCoords = currentIncident.probableOrigin;

  // Responsive leader line points
  const startX = dimensions.w * 0.52;
  const startY = (dimensions.h - 48) * 0.48;
  const midX = dimensions.w * 0.70;
  const midY = 150;
  const endX = Math.max(dimensions.w - 370, midX + 20);
  const endY = 150;
  const leaderPoints = `${startX},${startY} ${midX},${midY} ${endX},${endY}`;

  // Concentric multi-layer dispersion zones matching reference image
  // Centered around the incident coordinates
  const lat = centerCoords[0];
  const lon = centerCoords[1];

  // Outer zone (Deep blue/cyan)
  const outerEnvelope = [
    [lat + 0.12, lon + 0.05],
    [lat + 0.15, lon + 0.08],
    [lat + 0.10, lon + 0.14],
    [lat - 0.02, lon + 0.13],
    [lat - 0.09, lon + 0.08],
    [lat - 0.11, lon - 0.01],
    [lat - 0.07, lon - 0.06],
    [lat + 0.03, lon - 0.04],
  ];

  // Middle zone (Cyan)
  const midEnvelope = [
    [lat + 0.09, lon + 0.04],
    [lat + 0.11, lon + 0.07],
    [lat + 0.07, lon + 0.11],
    [lat - 0.01, lon + 0.10],
    [lat - 0.06, lon + 0.06],
    [lat - 0.08, lon - 0.00],
    [lat - 0.04, lon - 0.04],
    [lat + 0.02, lon - 0.02],
  ];

  // Inner zone (Emerald green)
  const innerEnvelope = [
    [lat + 0.06, lon + 0.03],
    [lat + 0.07, lon + 0.06],
    [lat + 0.04, lon + 0.08],
    [lat - 0.01, lon + 0.07],
    [lat - 0.04, lon + 0.04],
    [lat - 0.05, lon + 0.01],
    [lat - 0.02, lon - 0.02],
    [lat + 0.02, lon - 0.01],
  ];

  // Green matched commercial vessels tracks
  const greenTracks = [
    [
      [lat - 0.15, lon - 0.18],
      [lat - 0.08, lon - 0.12],
      [lat + 0.01, lon - 0.06],
      [lat + 0.08, lon - 0.04],
      [lat + 0.18, lon + 0.08],
    ],
    [
      [lat - 0.16, lon - 0.05],
      [lat - 0.09, lon - 0.08],
      [lat - 0.01, lon - 0.06],
      [lat + 0.06, lon - 0.02],
      [lat + 0.16, lon + 0.02],
    ],
    [
      [lat - 0.18, lon - 0.14],
      [lat - 0.10, lon - 0.09],
      [lat - 0.03, lon - 0.02],
      [lat + 0.05, lon + 0.04],
    ]
  ];

  // Orange dark vessel tracks with zigzag loitering turns matching reference
  const orangeLoiteringTrack = [
    [lat - 0.14, lon - 0.02],
    [lat - 0.08, lon - 0.03],
    [lat - 0.04, lon - 0.01],
    [lat + 0.01, lon + 0.02],
    // Zigzag loitering box
    [lat + 0.03, lon + 0.01],
    [lat + 0.03, lon + 0.07],
    [lat - 0.01, lon + 0.06],
    [lat - 0.01, lon + 0.01],
    [lat + 0.01, lon + 0.03],
    [lat + 0.04, lon + 0.05],
    [lat + 0.06, lon + 0.08],
    [lat + 0.12, lon + 0.14],
  ];

  const waypoints = environmentalData.trajectoryWaypoints || [];
  const driftPolyline = waypoints.map(wp => [wp.lat, wp.lon]);

  return (
    <div className="geoint-map-area">
      <MapContainer
        center={centerCoords}
        zoom={11}
        className="fullscreen-map"
        zoomControl={false}
      >
        <ChangeView center={centerCoords} zoom={11} />

        {/* Real Global Satellite Imagery Tiles (Esri World Imagery) */}
        <TileLayer
          attribution='&copy; Esri &copy; Earthstar Geographics'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={18}
        />

        {/* 1. Concentric Probability / Dispersion Isolines */}
        <Polygon
          positions={outerEnvelope}
          pathOptions={{
            color: '#38bdf8',
            fillColor: '#1e40af',
            fillOpacity: 0.28,
            weight: 1.5,
          }}
        />
        <Polygon
          positions={midEnvelope}
          pathOptions={{
            color: '#06b6d4',
            fillColor: '#0891b2',
            fillOpacity: 0.32,
            weight: 1.5,
          }}
        />
        <Polygon
          positions={innerEnvelope}
          pathOptions={{
            color: '#10b981',
            fillColor: '#059669',
            fillOpacity: 0.38,
            weight: 1.5,
          }}
        />

        {/* 2. Matched AIS Commercial Tracks (Green) */}
        {filters.matchedAisVessels && filters.showTrajectories && greenTracks.map((track, i) => (
          <Polyline
            key={`green-track-${i}`}
            positions={track}
            pathOptions={{
              color: '#22c55e',
              weight: 1.8,
              opacity: 0.85,
            }}
          />
        ))}

        {/* Green Vessel Badges on Map */}
        {filters.matchedAisVessels && (
          <>
            <Marker 
              position={[lat + 0.18, lon + 0.08]} 
              icon={createTacticalLabelIcon('MMSI: 356789012 | CARGO', 'green')}
            />
            <Marker 
              position={[lat + 0.01, lon - 0.06]} 
              icon={createTacticalLabelIcon('MMSI: 356789012 | CARGO', 'green')}
            />
            <Marker 
              position={[lat - 0.09, lon - 0.08]} 
              icon={createTacticalLabelIcon('MMSI: 356789012 | CARGO', 'green')}
            />
            <Marker 
              position={[lat - 0.16, lon - 0.12]} 
              icon={createTacticalLabelIcon('MMSI: 356789012 | CARGO', 'green')}
            />
          </>
        )}

        {/* 3. Unmatched / Dark Vessels Loitering Tracks (Orange) */}
        {filters.unmatchedVessels && filters.showTrajectories && (
          <Polyline
            positions={orangeLoiteringTrack}
            pathOptions={{
              color: '#f97316',
              weight: 2.2,
              opacity: 0.9,
              dashArray: '3, 4',
            }}
          />
        )}

        {/* Orange Tactical Badges on Map matching reference */}
        {filters.unmatchedVessels && (
          <>
            <Marker 
              position={[lat + 0.05, lon + 0.04]} 
              icon={createTacticalLabelIcon('POTENTIAL DARK VESSEL', 'orange')}
            />
            <Marker 
              position={[lat + 0.02, lon + 0.08]} 
              icon={createTacticalLabelIcon('AIS GHOSTING SUSPECTED', 'orange')}
            />
            <Marker 
              position={[lat - 0.03, lon + 0.03]} 
              icon={createTacticalLabelIcon('AIS GHOSTING SUSPECTED', 'orange')}
            />
            <Marker 
              position={[lat - 0.12, lon - 0.01]} 
              icon={createTacticalLabelIcon('UNMATCHED TARGET #42', 'orange')}
            />
          </>
        )}

        {/* Central Suspect Vessel Marker with White Hull */}
        <Marker 
          position={[lat + 0.01, lon + 0.02]}
          icon={createTargetShipIcon()}
          eventHandlers={{
            click: () => {
              onSelectTarget({
                label: "UNMATCHED TARGET #42",
                mmsi: "N/A (AIS NOT BROADCASTING)",
                imo: "UNKNOWN",
                callSign: "N/A",
                flag: "UNKNOWN (PANAMA REGISTRY SUSPECTED)",
                status: "UNMATCHED / DARK VESSEL",
                source: "OPTICAL & SAR FUSION",
                confidence: "92%",
                length: "185m",
                width: "28m",
                tonnage: "35,000 GT",
                classifiedType: "TANKER / BULK CARRIER",
                lastDetected: "2026-02-09 14:35:22 UTC",
                firstDetected: "2026-02-08 23:10:45 UTC",
                speed: "12.5 KNOTS",
                heading: "210° (SSW)",
                lastAisPos: "N/A",
                notes: "VESSEL OPERATING WITHOUT AIS IN RESTRICTED ZONE. RF SIGNALS DETECTED IN VICINITY CORRELATE WITH VESSEL POSITION. UNUSUAL LOITERING PATTERN OBSERVED.",
              });
            }
          }}
        />

        {/* 4. SAR Spill Extent Layer */}
        {(currentMode === 'sar' || filters.syntheticRadar) && satelliteScene.spillPolygon && (
          <Polygon
            positions={satelliteScene.spillPolygon}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.35,
              weight: 2,
              dashArray: '4, 4'
            }}
          />
        )}

        {/* 5. Backward Drift Reconstruction Layer */}
        {(currentMode === 'drift' || filters.rfSignalCorrelation) && (
          <>
            <Polyline
              positions={driftPolyline}
              pathOptions={{
                color: '#38bdf8',
                weight: 3,
                dashArray: '5, 5',
                opacity: 0.9
              }}
            />
            <Circle
              center={originCoords}
              radius={3200}
              pathOptions={{
                color: '#f59e0b',
                fillColor: '#f59e0b',
                fillOpacity: 0.25,
                weight: 1.5,
                dashArray: '4, 4'
              }}
            />
          </>
        )}
      </MapContainer>

      {/* Floating Tactical Overlay Leader Line (connects Target Ship to Right Panel) */}
      <svg 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 800,
        }}
      >
        <defs>
          <radialGradient id="targetRingPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f97316" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
          </radialGradient>
        </defs>

        {/* White Angled Leader Line from screen center target to right drawer */}
        <polyline 
          points={leaderPoints}
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="1.2" 
          strokeOpacity="0.85" 
        />
        <circle cx={endX} cy={endY} r="3" fill="#ffffff" />
      </svg>

      {/* Floating Tactical Map Scale HUD on Bottom Right */}
      <div className="map-scale-hud">
        <span>&lt; Scale 1:50,000 &gt;</span>
        <span style={{ color: '#64748b' }}>|</span>
        <span>120.158 KMW</span>
        <span>2.50.011S</span>
        <span>2200.2880</span>
      </div>
    </div>
  );
}
