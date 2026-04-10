import { useEffect, useRef, useCallback } from "react";

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
  const ws = useRef<InstanceType<typeof globalThis.WebSocket> | null>(null);
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
      if (ws.current?.readyState === globalThis.WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 10000);
  }, [stopHeartBeat]);

  const connect = useCallback(async (): Promise<InstanceType<
    typeof globalThis.WebSocket
  > | null> => {
    if (!busLineIdRef.current) return null;

    const socketUrl = "ws://10.192.91.255:8000/ws/tracking/";
    const socket = new globalThis.WebSocket(socketUrl);
    ws.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "init",
          bus_line_id: busLineIdRef.current,
        }),
      );
      retryCount.current = 0;
      startHeartBeat();
    };
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type !== "pong" && onBusUpdate) {
          onBusUpdate(data);
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message:", e);
      }
    };

    socket.onerror = (e) => {
      console.error("WebSocket error:", e);
      socket.close();
    };

    socket.onclose = () => {
      console.warn("WebSocket closed, attempting reconnect...");
      ws.current = null;
      stopHeartBeat();
      if (retryCount.current < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** retryCount.current, 30000);
        retryCount.current++;
        setTimeout(connect, delay);
      } else {
        console.error("WebSocket reconnect failed: max retries reached");
      }
    };

    return socket;
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
    if (ws.current?.readyState === globalThis.WebSocket.OPEN) {
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

  const isConnected = ws.current?.readyState === globalThis.WebSocket.OPEN;

  return { sendLocation, isConnected };
};

export default useTracking;
