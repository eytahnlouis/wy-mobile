import React, { useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import useTracking from "../hooks/useTracking";

interface DriverControlsProps {
  isTracking: boolean;
  setIsTracking: (val: boolean) => void;
  isFull: boolean;
  setIsFull: (val: boolean) => void;
  busLineId: number;
}

export const DriverControls = ({
  isTracking,
  setIsTracking,
  isFull,
  setIsFull,
  busLineId,
}: DriverControlsProps) => {
const { sendLocation, isConnected } = useTracking({
    busLineId,
    onBusUpdate: (msg) => console.log("bus update:", msg),
  });

  useEffect(() => {
    if (!isTracking) return;
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        sendLocation(coords.latitude, coords.longitude, isFull);
      },
      (err) => console.warn(err),
      ({ enableHighAccuracy: true, distanceFilter: 10 } as any),
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [isTracking, isFull, sendLocation]);

  return (
    
    <View style={styles.controls}>
      <TouchableOpacity
        style={[styles.button, isTracking ? styles.stopBtn : styles.startBtn]}
        onPress={() => setIsTracking(!isTracking)}
      >
        <Text style={styles.buttonText}>
          {isTracking ? "Stop" : "Start"} Tracking
        </Text>
      </TouchableOpacity>

      {isTracking && (
        <TouchableOpacity
          style={[styles.button, isFull ? styles.fullBtn : styles.emptyBtn]}
          onPress={() => setIsFull(!isFull)}
        >
          <Text style={styles.buttonText}>
            {isFull ? "Bus Plein" : "Bus avec Places"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    paddingHorizontal: 20,
    gap: 10,
  },
  button: {
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  startBtn: { backgroundColor: "#27AE60" },
  stopBtn: { backgroundColor: "#E74C3C" },
  fullBtn: { backgroundColor: "#F39C12" },
  emptyBtn: { backgroundColor: "#3498DB" },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
