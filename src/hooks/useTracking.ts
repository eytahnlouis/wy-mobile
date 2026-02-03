import { useEffect, useRef, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

interface UseTrackingOptions {
  busLineId: number | null;
  onBusUpdate?: (data: BusUpdateMessage) => void;
}

export interface BusUpdateMessage {
  bus_id: number;
  location: { lat: number; lon: number };
  is_full: boolean;
  etas: Record<string, number>;
}

const useTracking = ({ busLineId, onBusUpdate }: UseTrackingOptions) => {
  const ws = useRef<WebSocket | null>(null);
  const retryCount = useRef(0);
  const heartbeatInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const busLineIdRef = useRef(busLineId);
  const MAX_RETRIES = 10;

  busLineIdRef.current = busLineId;

  const stopHeartBeat = useCallback(() => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  }, []);

  const startHeartBeat = useCallback(() => {
    stopHeartBeat();
    heartbeatInterval.current = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 10000);
  }, [stopHeartBeat]);

  const connect = useCallback(async (): Promise<WebSocket | null> => {
    if (!busLineIdRef.current) return null;

    const token = await SecureStore.getItemAsync("userToken");
    const socketUrl = `ws://10.192.91.255:8000/ws/tracking/?token=${token}`;

    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      if (!ws.current) return;
      const initMessage = {
        type: "init",
        bus_line_id: busLineIdRef.current,
      };
      ws.current.send(JSON.stringify(initMessage));
      retryCount.current = 0;
      startHeartBeat();
    };
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type !== "pong" && onBusUpdate) {
          onBusUpdate(data);
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message:", e);
      }
    };

    ws.current.onerror = (e) => {
      console.log("Erreur WebSocket:", e);
      ws.current?.close();
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed, attempting reconnect...");
      ws.current = null;
      stopHeartBeat();
      if (retryCount.current < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** retryCount.current, 30000);
        retryCount.current++;
        setTimeout(connect, delay);
      } else {
        console.log("Max retries reached");
      }
    };

    return ws.current;
  }, [onBusUpdate, startHeartBeat, stopHeartBeat]);

  useEffect(() => {
    if (busLineId) {
      connect();
    }
    return () => {
      stopHeartBeat();
      ws.current?.close();
    };
  }, [busLineId, connect, stopHeartBeat]);

  const sendLocation = (
    latitude: number,
    longitude: number,
    isFull: boolean,
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "position",
          lat: latitude,
          lon: longitude,
          is_full: isFull,
        }),
      );
    }
  };

  const isConnected = ws.current?.readyState === WebSocket.OPEN;

  return { sendLocation, isConnected };
};

export default useTracking;
