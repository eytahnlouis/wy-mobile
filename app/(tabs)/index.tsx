import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useLocation } from "@/src/hooks/useLocation";
import useTracking, { BusUpdateMessage } from "@/src/hooks/useTracking";
import { DriverControls } from "@/src/components/DriverController";
import { LineSelector } from "@/src/components/LineSelector";
import { BusLine } from "@/src/api/busLineService";

interface BusMarker {
  bus_id: number;
  location: { lat: number; lon: number };
  is_full: boolean;
}

export default function TabIndex() {
  const { location } = useLocation();
  const [selectedLine, setSelectedLine] = useState<BusLine | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [busMarkers, setBusMarkers] = useState<Map<number, BusMarker>>(
    new Map(),
  );

  const handleBusUpdate = useCallback((data: BusUpdateMessage) => {
    setBusMarkers((prev) => {
      const newMarkers = new Map(prev);
      newMarkers.set(data.bus_id, {
        bus_id: data.bus_id,
        location: data.location,
        is_full: data.is_full,
      });
      return newMarkers;
    });
  }, []);

  const { sendLocation, isConnected } = useTracking({
    busLineId: selectedLine?.id ?? null,
    onBusUpdate: handleBusUpdate,
  });

  useEffect(() => {
    if (isTracking && location && isConnected) {
      sendLocation(location.coords.latitude, location.coords.longitude, isFull);
    }
  }, [location, isTracking, isFull, sendLocation, isConnected]);

  // Clear markers when line changes
  useEffect(() => {
    setBusMarkers(new Map());
  }, [selectedLine?.id]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={{
          latitude: location ? location.coords.latitude : 14.6937,
          longitude: location ? location.coords.longitude : -17.4441,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {Array.from(busMarkers.values()).map((bus) => (
          <Marker
            key={bus.bus_id}
            coordinate={{
              latitude: bus.location.lat,
              longitude: bus.location.lon,
            }}
            pinColor={bus.is_full ? "#E74C3C" : "#27AE60"}
            title={`Bus ${bus.bus_id}`}
            description={bus.is_full ? "Bus Plein" : "Places disponibles"}
          />
        ))}
      </MapView>

      <View style={styles.controls}>
        <LineSelector
          selectedLine={selectedLine}
          onSelectLine={setSelectedLine}
        />

        {selectedLine && (
          <DriverControls
            isTracking={isTracking}
            setIsTracking={setIsTracking}
            isFull={isFull}
            setIsFull={setIsFull}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  controls: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    paddingHorizontal: 20,
  },
});
