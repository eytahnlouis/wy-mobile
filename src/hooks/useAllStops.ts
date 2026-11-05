import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {MOCK_STOPS, USE_MOCK_ARRIVALS} from "../api/arrivalsService";
import type {StopPoint} from "../utils/geo";

const CACHE_KEY = "allstops_cache";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h, cohérent avec useBusStops

/**
 * Tous les arrêts accessibles à l'utilisateur, dédupliqués par stop_id.
 * HYPOTHÈSE : GET /api/gtfs/bus-line-stops/ sans bus_line_id renvoie toutes
 * les lignes (même format que useBusStops). À confirmer côté backend.
 */
export function useAllStops() {
    const [stops, setStops] = useState<StopPoint[]>(USE_MOCK_ARRIVALS ? MOCK_STOPS : []);
    const [loading, setLoading] = useState(!USE_MOCK_ARRIVALS);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (USE_MOCK_ARRIVALS) return;

        const load = async () => {
            let cached: { data: StopPoint[]; timestamp: number } | null = null;
            try {
                const raw = await AsyncStorage.getItem(CACHE_KEY);
                if (raw) {
                    cached = JSON.parse(raw);
                    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
                        setStops(cached.data);
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.warn("Cache read failed:", err);
                cached = null;
            }

            try {
                const res = await fetch(
                    `${process.env.EXPO_PUBLIC_API_URL}/api/gtfs/bus-line-stops/`,
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const rows: { stop: StopPoint }[] = await res.json();
                const byId = new Map<string, StopPoint>();
                for (const row of rows) {
                    const {stop_id, name, lat, lon} = row.stop;
                    byId.set(stop_id, {stop_id, name, lat, lon});
                }
                const data = [...byId.values()];
                setStops(data);
                await AsyncStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify({data, timestamp: Date.now()}),
                );
            } catch (err) {
                console.error("Failed to fetch stops:", err);
                if (cached) {
                    setStops(cached.data);
                    setError("Arrêts peut-être obsolètes (hors ligne)");
                } else {
                    setError("Impossible de charger les arrêts");
                }
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return {stops, loading, error};
}
