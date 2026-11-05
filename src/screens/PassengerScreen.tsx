import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {router} from "expo-router";
import {useAllStops} from "../hooks/useAllStops";
import {useNearestStops} from "../hooks/useNearestStops";
import {useArrivals} from "../hooks/useArrivals";
import {formatDistance} from "../utils/geo";
import type {Arrival} from "../api/arrivalsService";

const BRAND = "#41811F";

const formatEta = (seconds: number) => {
    if (seconds < 60) return "< 1 min";
    return `${Math.ceil(seconds / 60)} min`;
};

export default function PassengerScreen() {
    const {stops, loading: stopsLoading, error: stopsError} = useAllStops();
    const {nearest, loading: locLoading, error: locError, refresh} =
        useNearestStops(stops);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Sélectionne automatiquement l'arrêt le plus proche tant que l'user n'a pas choisi
    useEffect(() => {
        if (!selectedId && nearest.length > 0) setSelectedId(nearest[0].stop_id);
    }, [nearest, selectedId]);

    const {arrivals, loading: arrLoading, error: arrError} = useArrivals(selectedId);

    const renderArrival = ({item}: { item: Arrival }) => (
        <View style={styles.arrivalRow}>
            <View style={{flex: 1}}>
                <Text style={styles.lineName}>{item.line_name}</Text>
                <Text style={styles.plate}>{item.plate}</Text>
            </View>
            <Text style={styles.eta}>{formatEta(item.eta_seconds)}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>‹ Retour</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Prochains bus</Text>
            </View>

            <Text style={styles.section}>Arrêts proches</Text>
            {(stopsLoading || locLoading) && <ActivityIndicator color="#fff"/>}
            {(stopsError || locError) && (
                <Text style={styles.error}>{stopsError ?? locError}</Text>
            )}
            {nearest.map((s) => (
                <TouchableOpacity
                    key={s.stop_id}
                    style={[styles.stopRow, s.stop_id === selectedId && styles.stopRowActive]}
                    onPress={() => setSelectedId(s.stop_id)}
                >
                    <Text style={styles.stopName}>{s.name}</Text>
                    <Text style={styles.stopDist}>{formatDistance(s.distanceMeters)}</Text>
                </TouchableOpacity>
            ))}
            {!locLoading && (
                <TouchableOpacity onPress={refresh}>
                    <Text style={styles.refresh}>Actualiser ma position</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.section}>Arrivées</Text>
            {arrLoading && arrivals.length === 0 && <ActivityIndicator color="#fff"/>}
            {arrError && <Text style={styles.error}>{arrError}</Text>}
            <FlatList
                data={arrivals}
                keyExtractor={(a) => `${a.line_name}-${a.plate}`}
                renderItem={renderArrival}
                ListEmptyComponent={
                    selectedId && !arrLoading ? (
                        <Text style={styles.empty}>Aucun bus en approche.</Text>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {flex: 1, backgroundColor: BRAND, paddingHorizontal: 20},
    header: {paddingTop: 16, paddingBottom: 8},
    back: {color: "#fff", fontSize: 16, marginBottom: 8},
    title: {color: "#fff", fontSize: 26, fontWeight: "800"},
    section: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
        marginTop: 20,
        marginBottom: 8,
        opacity: 0.85,
    },
    stopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
    },
    stopRowActive: {backgroundColor: "#fff"},
    stopName: {fontSize: 15, fontWeight: "600", color: "#111"},
    stopDist: {fontSize: 14, color: "#555"},
    refresh: {color: "#fff", textDecorationLine: "underline", marginTop: 4},
    arrivalRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
    },
    lineName: {fontSize: 16, fontWeight: "700", color: "#111"},
    plate: {fontSize: 13, color: "#555", marginTop: 2},
    eta: {fontSize: 20, fontWeight: "800", color: BRAND},
    error: {color: "#fff", backgroundColor: "rgba(0,0,0,0.25)", padding: 10, borderRadius: 8},
    empty: {color: "#fff", opacity: 0.85, marginTop: 8},
});
