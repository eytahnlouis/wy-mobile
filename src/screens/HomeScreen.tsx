import React, { use, useState, useRef, useEffect } from "react";
import { useFonts } from "expo-font";
import MapView from "react-native-maps";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { BusCard } from "../components/Home/BusCard";
import { useLocation } from "../hooks/useLocation";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { HamburgerButton } from "../components/MenuControls";
import ControllerScreen from "./ControllerScreen";
export default function HomeScreen() {
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
    logo: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "700",
    },

    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      fontSize: 10,
      fontWeight: "800",
      color: "#111111",
    },
    bottomLabelWrap: {
      alignItems: "center",
      paddingBottom: 14,
    },
    bottomLabel: {
      color: "transparent",
      fontSize: 15,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    card: {
      position: "absolute",
      bottom: 32,
      alignSelf: "center",
      width: "90%",
    },
    busCard: {
      width: "100%",
    },
    HamburgerButton: {
      position: "absolute",
      top: 100,
      right: 40,
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
      <View style={styles.HamburgerButton}>
        <HamburgerButton onPress={() => setIsOpen(true)} />
      </View>
      {isOpen && (<ControllerScreen onClose={() => setIsOpen(false)} />
        )}
      <View style={{ flex: 1, backgroundColor: "transparent" }}>
        <View style={styles.card}>
          <BusCard
            buses={[
              {
                id: "1",
                plate: "AB-123-CD",
                direction: "Vers le centre-ville",
                minutes: 5,
                full: false,
              },
              {
                id: "2",
                plate: "EF-456-GH",
                direction: "Vers la gare",
                minutes: 12,
                full: true,
              },
              {
                id: "3",
                plate: "IJ-789-KL",
                direction: "Vers l'université",
                minutes: 18,
                full: false,
              },
            ]}
          />
        </View>
      </View>
      <StatusBar style="light" />
    </MapView>
  );
}
