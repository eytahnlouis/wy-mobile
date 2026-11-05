import {useCallback, useEffect, useState} from "react";
import * as Location from "expo-location";
import {nearestStops, StopPoint, StopWithDistance} from "../utils/geo";

/**
 * Arrêts les plus proches, calculés localement : une seule position
 * ponctuelle (pas de watchPositionAsync), la position ne quitte pas le téléphone.
 */
export function useNearestStops(stops: StopPoint[], count = 3) {
    const [nearest, setNearest] = useState<StopWithDistance[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (stops.length === 0) {
            setNearest([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setError("Localisation refusée : choisis ton arrêt à la main.");
                return;
            }
            const pos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setNearest(
                nearestStops(stops, pos.coords.latitude, pos.coords.longitude, count),
            );
        } catch (err) {
            console.warn("Nearest stops failed:", err);
            setError("Impossible d'obtenir ta position.");
        } finally {
            setLoading(false);
        }
    }, [stops, count]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {nearest, loading, error, refresh};
}
