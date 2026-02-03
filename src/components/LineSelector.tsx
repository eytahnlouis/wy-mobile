import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { BusLine, busLineService } from "@/src/api/busLineService";

interface LineSelectorProps {
  selectedLine: BusLine | null;
  onSelectLine: (line: BusLine) => void;
}

export const LineSelector = ({
  selectedLine,
  onSelectLine,
}: LineSelectorProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lines, setLines] = useState<BusLine[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalVisible && lines.length === 0) {
      loadLines();
    }
  }, [modalVisible]);

  const loadLines = async () => {
    setLoading(true);
    try {
      const data = await busLineService.getAll();
      setLines(data);
    } catch (error) {
      console.error("Failed to load bus lines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (line: BusLine) => {
    onSelectLine(line);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectorText}>
          {selectedLine ? selectedLine.name : "Sélectionner une ligne"}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir une ligne</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#3498DB" />
            ) : (
              <FlatList
                data={lines}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.lineItem,
                      selectedLine?.id === item.id && styles.selectedItem,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.lineName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>Aucune ligne disponible</Text>
                }
              />
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectorText: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "500",
  },
  arrow: {
    fontSize: 12,
    color: "#7F8C8D",
  },
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
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#2C3E50",
  },
  lineItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  selectedItem: {
    backgroundColor: "#E8F6FF",
  },
  lineName: {
    fontSize: 16,
    color: "#2C3E50",
  },
  emptyText: {
    textAlign: "center",
    color: "#7F8C8D",
    padding: 20,
  },
  closeButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#ECF0F1",
    borderRadius: 12,
    alignItems: "center",
  },
  closeText: {
    color: "#2C3E50",
    fontWeight: "600",
  },
});
