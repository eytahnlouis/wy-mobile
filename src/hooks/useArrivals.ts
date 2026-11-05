import {useCallback, useState} from "react";
import {AppState} from "react-native";
import {useFocusEffect} from "expo-router";
import {Arrival, arrivalsService} from "../api/arrivalsService";

const POLL_MS = 10_000;

/**
 * Polling des arrivées d'un arrêt. Actif seulement quand l'écran est
 * focus ET l'app au premier plan (pas de requêtes inutiles sur le serveur).
 */
export function useArrivals(stopId: string | null) {
    const [arrivals, setArrivals] = useState<Arrival[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            if (!stopId) {
                setArrivals([]);
                return;
            }

            let cancelled = false;
            let timer: ReturnType<typeof setInterval> | undefined;

            const load = async () => {
                try {
                    const data = await arrivalsService.getByStop(stopId);
                    if (cancelled) return;
                    setArrivals(
                        [...data.arrivals].sort((a, b) => a.eta_seconds - b.eta_seconds),
                    );
                    setError(null);
                } catch (err) {
                    if (cancelled) return;
                    console.warn("Arrivals fetch failed:", err);
                    setError("Impossible de récupérer les horaires.");
                } finally {
                    if (!cancelled) setLoading(false);
                }
            };

            const stopPolling = () => {
                if (timer) clearInterval(timer);
                timer = undefined;
            };
            const startPolling = () => {
                stopPolling();
                load();
                timer = setInterval(load, POLL_MS);
            };

            setLoading(true);
            startPolling();

            const sub = AppState.addEventListener("change", (state) => {
                stopPolling();
                if (state === "active") startPolling();
            });

            return () => {
                cancelled = true;
                stopPolling();
                sub.remove();
            };
        }, [stopId]),
    );

    return {arrivals, loading, error};
}
