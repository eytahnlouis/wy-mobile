import apiClient from "./client";
import type {StopPoint} from "../utils/geo";

export interface Arrival {
    line_name: string;
    plate: string;
    eta_seconds: number;
    updated_at: string;
}

export interface StopArrivals {
    stop_id: string;
    arrivals: Arrival[];
}

// Mock actif tant que le backend n'expose pas /stops/{id}/arrivals/.
// Mettre EXPO_PUBLIC_MOCK_ARRIVALS=false pour appeler le vrai endpoint.
export const USE_MOCK_ARRIVALS = process.env.EXPO_PUBLIC_MOCK_ARRIVALS !== "false";

export const MOCK_STOPS: StopPoint[] = [
    {stop_id: "mock-1", name: "Évry-Courcouronnes (gare)", lat: 48.6296, lon: 2.4407},
    {stop_id: "mock-2", name: "Université d'Évry", lat: 48.6249, lon: 2.4443},
    {stop_id: "mock-3", name: "Genopole", lat: 48.6252, lon: 2.4256},
    {stop_id: "mock-4", name: "Agora", lat: 48.6275, lon: 2.4271},
];

const mockArrivals = (stopId: string): StopArrivals => {
    const now = Date.now();
    // ETA qui décroît avec le temps, pour voir l'écran bouger au polling
    const wave = (period: number, offset: number) =>
        Math.max(20, period - (Math.floor(now / 1000) + offset) % period);
    return {
        stop_id: stopId,
        arrivals: [
            {
                line_name: "Ligne 1",
                plate: "AB-123-CD",
                eta_seconds: wave(600, 0),
                updated_at: new Date(now).toISOString(),
            },
            {
                line_name: "Ligne 2",
                plate: "EF-456-GH",
                eta_seconds: wave(900, 200),
                updated_at: new Date(now).toISOString(),
            },
        ],
    };
};

export const arrivalsService = {
    getByStop: async (stopId: string): Promise<StopArrivals> => {
        if (USE_MOCK_ARRIVALS) return mockArrivals(stopId);
        const response = await apiClient.get(`/stops/${stopId}/arrivals/`);
        return response.data;
    },
};
