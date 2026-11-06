import { LatLng, RouteData, Waypoint } from './types';
import { calculatePolylineDistance, generateRealisticElevation } from './geo';

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/foot';

export interface RouteFetchResult {
  coordinates: LatLng[];
  distanceKm: number;
  isSnapped: boolean;
  source: 'osrm' | 'direct';
  error?: string;
}

/**
 * Subsamples waypoints if there are too many for a single OSRM request.
 * Keeps first, last, and evenly distributed intermediate vertices.
 */
function subsampleWaypoints(points: LatLng[], maxPoints: number = 25): LatLng[] {
  if (points.length <= maxPoints) return points;

  const result: LatLng[] = [points[0]];
  const step = (points.length - 1) / (maxPoints - 1);

  for (let i = 1; i < maxPoints - 1; i++) {
    const idx = Math.round(i * step);
    result.push(points[idx]);
  }
  result.push(points[points.length - 1]);
  return result;
}

/**
 * Fetches a snapped foot route through a sequence of waypoints via OSRM demo server.
 * Gracefully falls back to direct straight-line polyline if offline, timed out, or rate-limited.
 */
export async function fetchOsrmRoute(
  waypoints: LatLng[],
  snapToRoads: boolean = true
): Promise<RouteFetchResult> {
  if (waypoints.length < 2) {
    return {
      coordinates: waypoints,
      distanceKm: 0,
      isSnapped: false,
      source: 'direct',
    };
  }

  // If user disabled snap to roads, return direct line immediately
  if (!snapToRoads) {
    const directDist = calculatePolylineDistance(waypoints);
    return {
      coordinates: waypoints,
      distanceKm: directDist,
      isSnapped: false,
      source: 'direct',
    };
  }

  // OSRM expects: {lon},{lat};{lon},{lat}...
  const queryPoints = subsampleWaypoints(waypoints, 24);
  const coordString = queryPoints
    .map((p) => `${p.lng.toFixed(6)},${p.lat.toFixed(6)}`)
    .join(';');

  const url = `${OSRM_BASE_URL}/${coordString}?overview=full&geometries=geojson&steps=false`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSRM server returned HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const primaryRoute = data.routes[0];
      const rawCoords: [number, number][] = primaryRoute.geometry.coordinates;

      // OSRM GeoJSON coords are [lng, lat] -> convert to LatLng {lat, lng}
      const coords: LatLng[] = rawCoords.map(([lng, lat]) => ({ lat, lng }));
      const distKm = primaryRoute.distance / 1000;

      return {
        coordinates: coords,
        distanceKm: distKm,
        isSnapped: true,
        source: 'osrm',
      };
    } else {
      throw new Error(data.message || 'OSRM failed to find suitable foot path');
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown routing error';
    console.warn('OSRM routing fallback to direct polyline:', errorMsg);

    // Fallback: direct polyline
    const directDist = calculatePolylineDistance(waypoints);
    return {
      coordinates: waypoints,
      distanceKm: directDist,
      isSnapped: false,
      source: 'direct',
      error: `Jalur OSRM tidak dapat dijangkau (${errorMsg}). Menggunakan garis langsung sebagai cadangan.`,
    };
  }
}

/**
 * Builds complete RouteData including realistic elevation profiles.
 */
export function buildRouteData(
  waypoints: Waypoint[],
  routeResult: RouteFetchResult,
  mode: RouteData['mode'],
  targetDistanceKm?: number,
  shapeName?: string
): RouteData {
  const { elevationGainM, elevationLossM, elevationProfile } = generateRealisticElevation(
    routeResult.coordinates,
    routeResult.distanceKm
  );

  return {
    coordinates: routeResult.coordinates,
    waypoints,
    distanceKm: routeResult.distanceKm,
    elevationGainM,
    elevationLossM,
    elevationProfile,
    isSnapped: routeResult.isSnapped,
    source: routeResult.source,
    mode,
    targetDistanceKm,
    shapeName,
  };
}
