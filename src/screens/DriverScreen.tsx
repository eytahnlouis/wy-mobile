import React, { useState, useRef, useEffect } from "react";
import { useFonts } from "expo-font";
import MapView from "react-native-maps";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { BusCard } from "../components/Home/BusCard";
import { useLocation } from "../hooks/useLocation";
import { router, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { HamburgerButton } from "../components/MenuControls";
import useTracking  from "../hooks/useTracking";
import { DriverControls } from "../components/DriverController";
import ControllerScreen from "./ControllerScreen";

export default function DriverScreen() {
 const route = useRouter();
 
  const [loading, setLoading] = useState(false);
  const [loaded] = useFonts({
    KonkhmerSleokchher: require("@/assets/fonts/KonkhmerSleokchher-Regular.ttf"),
  });
  const [isOpen, setIsOpen] = useState(false);

  const { location } = useLocation();
  const mapRef = useRef<MapView>(null);
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      ); // 1000ms d'animation
    }
  }, [location]);

  if (!loaded) {
    return null;
  }

  // quand la location arrive, anime la caméra

  const handleGo = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/login");
    }, 250); // Simule un délai de connexion
  };
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "transparent",
    },
    container: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: "space-between",
      zIndex: 2,
    },
    header: {
      paddingTop: 14,
      alignItems: "flex-start",
    },
  });
  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      scrollEnabled // drag pour bouger
      zoomEnabled // pinch pour zoomer
      rotateEnabled // rotation
      pitchEnabled // inclinaison
      showsUserLocation
    >

    <DriverControls isTracking={false} setIsTracking={function (val: boolean): void {
              throw new Error("Function not implemented.");
          } } isFull={false} setIsFull={function (val: boolean): void {
              throw new Error("Function not implemented.");
          } } />
    </MapView>
  );
}