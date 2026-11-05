export interface StopPoint {
    stop_id: string;
    name: string;
    lat: number;
    lon: number;
}

export interface StopWithDistance extends StopPoint {
    distanceMeters: number;
}

const EARTH_RADIUS_M = 6371000;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Distance à vol d'oiseau en mètres (formule de haversine). */
export function haversineMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Les `count` arrêts les plus proches, triés par distance croissante. */
export function nearestStops(
    stops: StopPoint[],
    lat: number,
    lon: number,
    count = 3,
): StopWithDistance[] {
    return stops
        .map((s) => ({
            ...s,
            distanceMeters: haversineMeters(lat, lon, s.lat, s.lon),
        }))
        .sort((a, b) => a.distanceMeters - b.distanceMeters)
        .slice(0, count);
}

export function formatDistance(meters: number): string {
    if (meters < 1000) return `${Math.round(meters / 10) * 10} m`;
    return `${(meters / 1000).toFixed(1)} km`;
}
