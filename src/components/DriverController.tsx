import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

interface DriverControlsProps {
  isTracking: boolean;
  setIsTracking: (val: boolean) => void;
  isFull: boolean;
  setIsFull: (val: boolean) => void;
}

export const DriverControls = ({
  isTracking,
  setIsTracking,
  isFull,
  setIsFull,
}: DriverControlsProps) => {
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
