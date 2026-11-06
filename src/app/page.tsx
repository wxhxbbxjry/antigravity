'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  LatLng,
  Waypoint,
  RouteData,
  RouteMode,
  TileLayerId,
  GpsShapeKey,
} from '@/lib/types';
import { GPS_SHAPES } from '@/lib/shapes';
import {
  generateLoopWaypoints,
  transformShapePoints,
} from '@/lib/geo';
import { fetchOsrmRoute, buildRouteData } from '@/lib/osrm';

import Sidebar from '@/components/UI/Sidebar';
import StatsHud from '@/components/UI/StatsHud';
import ElevationProfile from '@/components/UI/ElevationProfile';
import ExportModal from '@/components/UI/ExportModal';
import Toast, { ToastMessage } from '@/components/UI/Toast';

// Dynamically import Leaflet Map with SSR disabled
const RouteMap = dynamic(() => import('@/components/Map/RouteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#080c14] text-slate-400 gap-3">
      <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-semibold text-slate-300">
        Memuat Peta Interaktif & Engine Routing...
      </span>
    </div>
  ),
});

export default function HomePage() {
  // Navigation & Mode
  const [currentMode, setCurrentMode] = useState<RouteMode>('manual');
  const [selectedTile, setSelectedTile] = useState<TileLayerId>('dark');

  // Waypoints & Route
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [snapToRoads, setSnapToRoads] = useState<boolean>(true);
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);

  // Random Loop Generator State
  const [startLocation, setStartLocation] = useState<LatLng | null>({
    lat: -6.2088,
    lng: 106.8456, // Central Jakarta / Monas default
  });
  const [targetDistanceKm, setTargetDistanceKm] = useState<number>(10);
  const [loopHeadingOffset, setLoopHeadingOffset] = useState<number>(45);

  // GPS Art State
  const [selectedShape, setSelectedShape] = useState<GpsShapeKey>('heart');
  const [artCenterLocation, setArtCenterLocation] = useState<LatLng | null>({
    lat: -6.2088,
    lng: 106.8456,
  });
  const [artScaleKm, setArtScaleKm] = useState<number>(3.5);
  const [artRotationDeg, setArtRotationDeg] = useState<number>(0);
  const [showBlueprint, setShowBlueprint] = useState<boolean>(true);
  const [blueprintCoords, setBlueprintCoords] = useState<LatLng[] | null>(null);

  // Stats & Pace
  const [paceSeconds, setPaceSeconds] = useState<number>(360); // 6:00 / km
  const [showElevation, setShowElevation] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (type: ToastMessage['type'], title: string, description?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      setToasts((prev) => [...prev, { id, type, title, description }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Update GPS Art Blueprint coordinates when shape, center, scale, or rotation changes
  useEffect(() => {
    if (!artCenterLocation) return;
    const shapeDef = GPS_SHAPES[selectedShape];
    if (!shapeDef) return;

    const transformed = transformShapePoints(
      shapeDef.points,
      artCenterLocation,
      artScaleKm,
      artRotationDeg
    );
    setBlueprintCoords(transformed);
  }, [selectedShape, artCenterLocation, artScaleKm, artRotationDeg]);

  // Handle Map Clicks based on current active mode
  const handleMapClick = useCallback(
    async (clickedLatLng: LatLng) => {
      if (currentMode === 'manual') {
        const newWaypoint: Waypoint = {
          id: `wp-${Date.now()}-${waypoints.length + 1}`,
          lat: clickedLatLng.lat,
          lng: clickedLatLng.lng,
          name: `Point ${waypoints.length + 1}`,
        };

        const updatedWaypoints = [...waypoints, newWaypoint];
        setWaypoints(updatedWaypoints);

        if (updatedWaypoints.length >= 2) {
          setIsLoadingRoute(true);
          const result = await fetchOsrmRoute(updatedWaypoints, snapToRoads);
          setIsLoadingRoute(false);

          if (result.error) {
            addToast('warning', 'OSRM Demo Limit / Offline', result.error);
          }

          const built = buildRouteData(
            updatedWaypoints,
            result,
            'manual',
            undefined,
            undefined
          );
          setRouteData(built);
        } else {
          // Single waypoint placed
          setRouteData(null);
        }
      } else if (currentMode === 'random') {
        setStartLocation(clickedLatLng);
        addToast(
          'info',
          'Titik Start Dipilih',
          `Lokasi diatur ke [${clickedLatLng.lat.toFixed(4)}, ${clickedLatLng.lng.toFixed(4)}]`
        );
      } else if (currentMode === 'art') {
        setArtCenterLocation(clickedLatLng);
        addToast(
          'info',
          'Pusat GPS Art Dipindahkan',
          `Titik tengah gambar diatur ke lokasi yang diklik.`
        );
      }
    },
    [currentMode, waypoints, snapToRoads, addToast]
  );

  // Manual Mode Actions: Toggle Snap
  const handleToggleSnap = useCallback(
    async (newSnapState: boolean) => {
      setSnapToRoads(newSnapState);
      if (waypoints.length >= 2) {
        setIsLoadingRoute(true);
        const result = await fetchOsrmRoute(waypoints, newSnapState);
        setIsLoadingRoute(false);
        const built = buildRouteData(
          waypoints,
          result,
          currentMode,
          targetDistanceKm,
          currentMode === 'art' ? GPS_SHAPES[selectedShape]?.name : undefined
        );
        setRouteData(built);
      }
    },
    [waypoints, currentMode, targetDistanceKm, selectedShape]
  );

  // Manual Mode Actions: Undo
  const handleUndoWaypoint = useCallback(async () => {
    if (waypoints.length === 0) return;
    const updated = waypoints.slice(0, -1);
    setWaypoints(updated);

    if (updated.length >= 2) {
      setIsLoadingRoute(true);
      const result = await fetchOsrmRoute(updated, snapToRoads);
      setIsLoadingRoute(false);
      setRouteData(buildRouteData(updated, result, 'manual'));
    } else {
      setRouteData(null);
    }
  }, [waypoints, snapToRoads]);

  // Manual Mode Actions: Clear
  const handleClearWaypoints = useCallback(() => {
    setWaypoints([]);
    setRouteData(null);
    addToast('info', 'Rute Direset', 'Semua titik waypoint telah dihapus.');
  }, [addToast]);

  // Manual Mode Actions: Close Loop
  const handleCloseLoop = useCallback(async () => {
    if (waypoints.length < 2) return;
    const startPoint = waypoints[0];
    const closedWaypoints = [
      ...waypoints,
      {
        id: `wp-${Date.now()}-finish`,
        lat: startPoint.lat,
        lng: startPoint.lng,
        name: 'Finish Loop',
      },
    ];

    setWaypoints(closedWaypoints);
    setIsLoadingRoute(true);
    const result = await fetchOsrmRoute(closedWaypoints, snapToRoads);
    setIsLoadingRoute(false);
    setRouteData(buildRouteData(closedWaypoints, result, 'manual'));
    addToast('success', 'Loop Berhasil Ditutup', 'Rute sekarang kembali ke titik start!');
  }, [waypoints, snapToRoads, addToast]);

  // Manual Mode Actions: Reverse Route
  const handleReverseRoute = useCallback(async () => {
    if (waypoints.length < 2) return;
    const reversed = [...waypoints].reverse();
    setWaypoints(reversed);
    setIsLoadingRoute(true);
    const result = await fetchOsrmRoute(reversed, snapToRoads);
    setIsLoadingRoute(false);
    setRouteData(buildRouteData(reversed, result, 'manual'));
    addToast('info', 'Arah Dibalik', 'Titik awal dan akhir rute telah ditukar.');
  }, [waypoints, snapToRoads, addToast]);

  // Random Loop Generator
  const handleGenerateLoop = useCallback(
    async (offsetHeading?: number) => {
      if (!startLocation) {
        addToast('warning', 'Pilih Lokasi Awal', 'Klik pada peta untuk menentukan titik start.');
        return;
      }

      setIsLoadingRoute(true);
      const heading = offsetHeading !== undefined ? offsetHeading : Math.random() * 360;
      setLoopHeadingOffset(heading);

      // Generate circular waypoints
      const loopCoords = generateLoopWaypoints(startLocation, targetDistanceKm, {
        headingOffsetDeg: heading,
        numVertices: targetDistanceKm > 20 ? 8 : 6,
        jitterFactor: 0.12,
      });

      const loopWaypoints: Waypoint[] = loopCoords.map((pt, idx) => ({
        id: `loop-${idx}`,
        lat: pt.lat,
        lng: pt.lng,
        name: idx === 0 ? 'Start/Finish' : `Loop Km ${(idx * 1.5).toFixed(1)}`,
      }));

      setWaypoints(loopWaypoints);

      // Route through OSRM
      const result = await fetchOsrmRoute(loopCoords, true);
      setIsLoadingRoute(false);

      if (result.error) {
        addToast('warning', 'OSRM Limit', result.error);
      }

      const built = buildRouteData(
        loopWaypoints,
        result,
        'random',
        targetDistanceKm
      );
      setRouteData(built);

      addToast(
        'success',
        `Random Loop ${targetDistanceKm}K Siap!`,
        `Jarak kalkulasi rute: ${result.distanceKm.toFixed(2)} km.`
      );
    },
    [startLocation, targetDistanceKm, addToast]
  );

  // Random Loop: Re-roll
  const handleReRollLoop = useCallback(() => {
    const nextHeading = (loopHeadingOffset + 60 + Math.random() * 30) % 360;
    handleGenerateLoop(nextHeading);
  }, [loopHeadingOffset, handleGenerateLoop]);

  // GPS Art Generator
  const handleGenerateArt = useCallback(async () => {
    if (!artCenterLocation) {
      addToast('warning', 'Pusat Belum Dipilih', 'Klik peta untuk menentukan titik gambar.');
      return;
    }

    const shapeDef = GPS_SHAPES[selectedShape];
    if (!shapeDef) return;

    setIsLoadingRoute(true);
    const transformed = transformShapePoints(
      shapeDef.points,
      artCenterLocation,
      artScaleKm,
      artRotationDeg
    );
    setBlueprintCoords(transformed);

    const artWaypoints: Waypoint[] = transformed.map((pt, idx) => ({
      id: `art-pt-${idx}`,
      lat: pt.lat,
      lng: pt.lng,
      name: `${shapeDef.name} #${idx + 1}`,
    }));

    setWaypoints(artWaypoints);

    // Route calculation
    const result = await fetchOsrmRoute(transformed, snapToRoads);
    setIsLoadingRoute(false);

    if (result.error) {
      addToast('warning', 'OSRM Fallback', result.error);
    }

    const built = buildRouteData(
      artWaypoints,
      result,
      'art',
      artScaleKm,
      shapeDef.name
    );
    setRouteData(built);

    // Trigger celebration confetti
    if (typeof window !== 'undefined') {
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore
      }
    }

    addToast(
      'success',
      `GPS Art ${shapeDef.name} Terbentuk!`,
      `Total lari: ${result.distanceKm.toFixed(2)} km. Anda siap berlari membuat karya seni!`
    );
  }, [
    artCenterLocation,
    selectedShape,
    artScaleKm,
    artRotationDeg,
    snapToRoads,
    addToast,
  ]);

  // Geolocation quick helper
  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      addToast('warning', 'GPS Tidak Tersedia', 'Browser tidak mendukung geolokasi.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (currentMode === 'random') {
          setStartLocation(userLoc);
        } else if (currentMode === 'art') {
          setArtCenterLocation(userLoc);
        }
        addToast(
          'success',
          'Lokasi GPS Terdeteksi',
          `Koordinat [${userLoc.lat.toFixed(4)}, ${userLoc.lng.toFixed(4)}]`
        );
      },
      (err) => {
        addToast('warning', 'Gagal Mengambil GPS', err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [currentMode, addToast]);

  return (
    <main className="relative w-screen h-screen overflow-hidden flex bg-[#080c14]">
      {/* Interactive Fullscreen Map */}
      <div className="absolute inset-0 z-0">
        <RouteMap
          waypoints={waypoints}
          routeData={routeData}
          blueprintCoords={blueprintCoords}
          showBlueprint={showBlueprint}
          selectedTile={selectedTile}
          onTileChange={setSelectedTile}
          onMapClick={handleMapClick}
          centerLocation={currentMode === 'art' ? artCenterLocation : startLocation}
          isArtMode={currentMode === 'art'}
        />
      </div>

      {/* Floating Control Sidebar (Desktop & Mobile) */}
      <Sidebar
        currentMode={currentMode}
        onModeChange={(m) => {
          setCurrentMode(m);
          // If switching to art mode and no blueprint exists, generate one
          if (m === 'art' && artCenterLocation) {
            const transformed = transformShapePoints(
              GPS_SHAPES[selectedShape].points,
              artCenterLocation,
              artScaleKm,
              artRotationDeg
            );
            setBlueprintCoords(transformed);
          }
        }}
        waypoints={waypoints}
        routeData={routeData}
        snapToRoads={snapToRoads}
        onToggleSnap={handleToggleSnap}
        onUndoWaypoint={handleUndoWaypoint}
        onClearWaypoints={handleClearWaypoints}
        onCloseLoop={handleCloseLoop}
        onReverseRoute={handleReverseRoute}
        startLocation={startLocation}
        targetDistanceKm={targetDistanceKm}
        onTargetDistanceChange={setTargetDistanceKm}
        onUseMyLocation={handleUseMyLocation}
        onGenerateLoop={() => handleGenerateLoop()}
        onReRollLoop={handleReRollLoop}
        selectedShape={selectedShape}
        onSelectShape={setSelectedShape}
        artCenterLocation={artCenterLocation}
        artScaleKm={artScaleKm}
        onArtScaleChange={setArtScaleKm}
        artRotationDeg={artRotationDeg}
        onArtRotationChange={setArtRotationDeg}
        showBlueprint={showBlueprint}
        onToggleBlueprint={setShowBlueprint}
        onGenerateArt={handleGenerateArt}
        isLoading={isLoadingRoute}
      />

      {/* Floating Top/Bottom Stats HUD & Elevation Profile (Desktop & Mobile) */}
      <div className="absolute right-4 bottom-4 md:bottom-6 z-30 max-w-sm w-full space-y-3 pointer-events-none">
        {/* Elevation Profile (Conditional) */}
        {showElevation && routeData && (
          <div className="pointer-events-auto animate-in slide-in-from-bottom-3 fade-in duration-200">
            <ElevationProfile
              profile={routeData.elevationProfile}
              gainM={routeData.elevationGainM}
              lossM={routeData.elevationLossM}
              distanceKm={routeData.distanceKm}
            />
          </div>
        )}

        {/* Live Running Metrics HUD */}
        <div className="pointer-events-auto">
          <StatsHud
            routeData={routeData}
            paceSeconds={paceSeconds}
            onPaceChange={setPaceSeconds}
            onOpenExport={() => setIsExportOpen(true)}
            showElevation={showElevation}
            onToggleElevation={() => setShowElevation(!showElevation)}
          />
        </div>
      </div>

      {/* Export GPX / GeoJSON Modal */}
      {routeData && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          routeData={routeData}
          paceSeconds={paceSeconds}
        />
      )}

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </main>
  );
}
