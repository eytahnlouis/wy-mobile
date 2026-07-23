import {useEffect, useRef, useCallback, useState} from "react";
import * as SecureStore from "expo-secure-store";

interface UseTrackingOptions {
    busLineId: number | null;
    authToken?: string;
    onBusUpdate?: (data: BusUpdateMessage) => void;
}

export interface BusUpdateMessage {
    bus_id: number;
    location: { lat: number; lon: number };
    is_full: boolean;
    etas: Record<string, number>;
}

const useTracking = ({busLineId, authToken, onBusUpdate}: UseTrackingOptions) => {
    const ws = useRef<InstanceType<typeof globalThis.WebSocket> | null>(null);
    const retryCount = useRef(0);
    const heartbeatInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Refs pour garder les valeurs à jour sans re-déclencher les callbacks/effects
    const busLineIdRef = useRef(busLineId);
    const onBusUpdateRef = useRef(onBusUpdate);
    const authTokenRef = useRef(authToken);

    const [isConnected, setIsConnected] = useState(false);
    const MAX_RETRIES = 10;

    // Mise à jour des refs à chaque render
    busLineIdRef.current = busLineId;
    onBusUpdateRef.current = onBusUpdate;
    if (authToken) authTokenRef.current = authToken;

    const stopHeartBeat = useCallback(() => {
        if (heartbeatInterval.current) {
            clearInterval(heartbeatInterval.current);
            heartbeatInterval.current = null;
        }
    }, []);

    //  Fonction de déconnexion réutilisable
    const disconnect = useCallback(() => {
        stopHeartBeat();

        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = null;
        }

        if (ws.current) {
            // Désactiver onclose pour éviter que le handler de retry auto ne se déclenche
            ws.current.onclose = null;
            ws.current.close();
            ws.current = null;
        }

        setIsConnected(false);
    }, [stopHeartBeat]);

    const startHeartBeat = useCallback(() => {
        stopHeartBeat();
        heartbeatInterval.current = setInterval(() => {
            if (ws.current?.readyState === globalThis.WebSocket.OPEN) {
                ws.current.send(JSON.stringify({type: "ping"}));
            }
        }, 10000);
    }, [stopHeartBeat]);

    const connect = useCallback(() => {
        if (!busLineIdRef.current) return;

        // Évite de réouvrir une socket si une connexion est déjà active/en cours
        if (
            ws.current &&
            (ws.current.readyState === globalThis.WebSocket.OPEN ||
                ws.current.readyState === globalThis.WebSocket.CONNECTING)
        ) {
            return;
        }

        const tokenParam = authTokenRef.current ? `&token=${authTokenRef.current}` : "";
        const socketUrl = `${process.env.EXPO_PUBLIC_TRACKING_API_URL}?bus_line_id=${busLineIdRef.current}${tokenParam}`;

        const socket = new globalThis.WebSocket(socketUrl);
        ws.current = socket;

        socket.onopen = () => {
            setIsConnected(true);
            socket.send(
                JSON.stringify({
                    type: "init",
                    bus_line_id: busLineIdRef.current,
                })
            );
            retryCount.current = 0;
            startHeartBeat();
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type !== "pong" && onBusUpdateRef.current) {
                    onBusUpdateRef.current(data);
                }
            } catch (e) {
                console.error("Failed to parse WebSocket message:", e);
            }
        };

        socket.onerror = (e) => {
            console.error("WebSocket error:", e);
        };

        socket.onclose = (e) => {
            setIsConnected(false);
            console.warn(`WebSocket closed (${e.code}), attempting reconnect...`);
            ws.current = null;
            stopHeartBeat();

            if (retryCount.current < MAX_RETRIES) {
                const delay = Math.min(1000 * 2 ** retryCount.current, 30000);
                retryCount.current++;
                reconnectTimeout.current = setTimeout(connect, delay);
            } else {
                console.error("WebSocket reconnect failed: max retries reached");
            }
        };
    }, [startHeartBeat, stopHeartBeat]);

    // Cycle de vie principal : Récupération du Token + Connexion
    useEffect(() => {
        let isMounted = true;

        const initAndConnect = async () => {
            if (!authTokenRef.current) {
                try {
                    const storedToken = await SecureStore.getItemAsync("userToken");
                    if (storedToken && isMounted) {
                        authTokenRef.current = storedToken;
                    }
                } catch (e) {
                    console.error("Erreur de récupération du token:", e);
                }
            }

            if (busLineId && isMounted) {
                connect();
            }
        };

        initAndConnect();

        // 🧹 Nettoyage automatique si busLineId change ou au démontage
        return () => {
            isMounted = false;
            disconnect();
        };
    }, [busLineId, connect, disconnect]);

    const sendLocation = useCallback(
        (latitude: number, longitude: number, isFull: boolean) => {
            if (ws.current?.readyState === globalThis.WebSocket.OPEN) {
                ws.current.send(
                    JSON.stringify({
                        type: "position",
                        lat: latitude,
                        lon: longitude,
                        is_full: isFull,
                    })
                );
            }
        },
        []
    );

    // Expose sendLocation, isConnected et disconnect
    return {sendLocation, isConnected, disconnect};
};

export default useTracking;