import React, {useState, useRef, useEffect} from "react";
import {useFonts} from "expo-font";
import MapView from "react-native-maps";
import {StyleSheet, View, TouchableOpacity} from "react-native";
import {useLocation} from "../hooks/useLocation";
import {router, useRouter} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {HamburgerButton} from "../components/MenuControls";
import useTracking from "../hooks/useTracking";
import {DriverControls} from "../components/DriverController";
import ControllerScreen from "./ControllerScreen";
import {BusLineSelector} from "../components/BusLineSelector";

export default function DriverScreen() {
    const route = useRouter();

    const [loading, setLoading] = useState(false);
    const [loaded] = useFonts({
        KonkhmerSleokchher: require("@/assets/fonts/KonkhmerSleokchher-Regular.ttf"),
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isFull, setIsFull] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    const [busLineId, setBusLineId] = useState<number | null>(null); // ID de la ligne de bus, à récupérer dynamiquement

    const {location} = useLocation();
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
        HamburgerButton: {
            position: "absolute",
            top: 120,
            left: 40,
            zIndex: 1,
        },
        lineSelector: {
            position: "absolute",
            top: 60,
            left: 24,
            right: 24,
            zIndex: 1,
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
            showsMyLocationButton
            followsUserLocation
        >
            <View style={styles.lineSelector}>
                {!isTracking && (<BusLineSelector
                    selectedLineId={busLineId}
                    onSelect={(lineId) => setBusLineId(lineId)}
                />)}
            </View>

            <View style={styles.HamburgerButton}>
                <HamburgerButton onPress={() => setIsOpen(!isOpen)}/>
                {isOpen && (<ControllerScreen onClose={() => setIsOpen(!isOpen)}/>
                )}
            </View>
            <StatusBar style="light"/>
            {busLineId !== null && (<DriverControls
                isFull={isFull}
                setIsFull={setIsFull}
                isTracking={isTracking}
                setIsTracking={setIsTracking}
                busLineId={busLineId}
            />)
            }
        </MapView>
    );
}