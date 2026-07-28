import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Modal} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface BusLine {
    id: number;
    name: string;
    region: string | null;
}

interface BusLineSelectorProps {
    selectedLineId: number | null;
    onSelect: (lineId: number) => void;
}

export const BusLineSelector = ({selectedLineId, onSelect}: BusLineSelectorProps) => {
    const [lines, setLines] = useState<BusLine[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const CACHE_KEY = "buslines_cache";
    const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h, cohérent avec le cache backend

    useEffect(() => {
        const fetchLines = async () => {
            setLoading(true);
            setError(null);

            let cachedEntry: { data: BusLine[]; timestamp: number } | null = null;

            // 1. Lecture du cache local
            try {
                const cached = await AsyncStorage.getItem(CACHE_KEY);
                if (cached) {
                    cachedEntry = JSON.parse(cached);
                    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
                        setLines(cachedEntry.data);
                        setLoading(false);
                        return; // cache valide, pas de fetch réseau
                    }
                }
            } catch (err) {
                console.warn("Cache read failed:", err);
                cachedEntry = null;
            }

            // 2. Cache absent/expiré → fetch réseau
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/gtfs/buslines/`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                setLines(data);

                await AsyncStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify({data, timestamp: Date.now()})
                );
            } catch (err) {
                console.error("Failed to fetch bus lines:", err);

                // 3. Fallback : cache expiré vaut mieux que rien
                if (cachedEntry) {
                    setLines(cachedEntry.data);
                    setError("Liste peut-être obsolète (hors ligne)");
                } else {
                    setError("Impossible de charger les lignes");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchLines();
    }, []);

    const selectedLine = lines.find((l) => l.id === selectedLineId);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.selector}
                onPress={() => setModalVisible(true)}
                disabled={loading}
            >
                <Text style={styles.selectorText}>
                    {loading
                        ? "Chargement des lignes..."
                        : selectedLine
                            ? selectedLine.name
                            : "Sélectionner une ligne"}
                </Text>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Choisir une ligne</Text>
                        <FlatList
                            data={lines}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={styles.lineItem}
                                    onPress={() => {
                                        onSelect(item.id);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.lineItemText}>{item.name}</Text>
                                    {item.region && <Text style={styles.lineItemRegion}>{item.region}</Text>}
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>Aucune ligne disponible</Text>
                            }
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {marginBottom: 10},
    selector: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: 15,
        elevation: 3,
    },
    selectorText: {fontSize: 16, fontWeight: "600", color: "#333"},
    errorText: {color: "#E74C3C", marginTop: 5, fontSize: 12},
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: "60%",
    },
    modalTitle: {fontSize: 18, fontWeight: "bold", marginBottom: 15},
    lineItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    lineItemText: {fontSize: 16, color: "#333"},
    lineItemRegion: {fontSize: 12, color: "#999", marginTop: 2},
    emptyText: {textAlign: "center", color: "#999", padding: 20},
    closeButton: {marginTop: 15, padding: 12, alignItems: "center"},
    closeButtonText: {color: "#E74C3C", fontWeight: "600"},
});