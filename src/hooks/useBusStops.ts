import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface BusStop {
    id: number;
    stop_id: string;
    name: string;
    lat: number;
    lon: number;
}

interface BusLineStop {
    id: number;
    bus_line: number;
    stop: BusStop;
    sequence: number;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h, cohérent avec le reste

export function useBusStops(busLineId: number | null) {
    const [stops, setStops] = useState<BusLineStop[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (busLineId === null) {
            setStops([]);
            return;
        }

        const cacheKey = `buslinestops_cache_${busLineId}`;

        const fetchStops = async () => {
            setLoading(true);
            setError(null);
            let cachedEntry: { data: BusLineStop[]; timestamp: number } | null = null;

            try {
                const cached = await AsyncStorage.getItem(cacheKey);
                if (cached) {
                    cachedEntry = JSON.parse(cached);
                    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
                        setStops(cachedEntry.data);
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.warn("Cache read failed:", err);
                cachedEntry = null;
            }

            try {
                const response = await fetch(
                    `${process.env.EXPO_PUBLIC_API_URL}/api/gtfs/bus-line-stops/?bus_line_id=${busLineId}`
                );
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                setStops(data);
                await AsyncStorage.setItem(
                    cacheKey,
                    JSON.stringify({data, timestamp: Date.now()})
                );
            } catch (err) {
                console.error("Failed to fetch bus stops:", err);
                if (cachedEntry) {
                    setStops(cachedEntry.data);
                    setError("Arrêts peut-être obsolètes (hors ligne)");
                } else {
                    setError("Impossible de charger les arrêts");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStops();
    }, [busLineId]);

    return {stops, loading, error};
}