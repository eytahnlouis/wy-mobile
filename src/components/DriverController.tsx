import React, { useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import useTracking from "../hooks/useTracking";
import * as Location from "expo-location";

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

    let subscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      // 1. Demande de permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission de géolocalisation refusée");
        setIsTracking(false);
        return;
      }

      // 2. Démarrage du tracking avec Expo
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Remplace distanceFilter (en mètres)
          timeInterval: 3000,   // Fréquence min de maj (en ms)
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          sendLocation(latitude, longitude, isFull);
        }
      );
    };

    startTracking().catch((err) => console.warn(err));

    // 3. Nettoyage lors du démontage ou quand isTracking passe à false
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isTracking, isFull, sendLocation, setIsTracking]);

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