// components/BusCard.tsx
import { View, StyleSheet, ScrollView } from "react-native";
import { BusRow } from "./BusRow";
import { AdBanner } from "./AdBanner";

type Bus = {
  id: string;
  plate: string;
  direction: string;
  minutes: number;
  full?: boolean;
};

type BusCardProps = {
  buses: Bus[];
};

export function BusCard({ buses }: BusCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.rows}>
        <ScrollView>
        {buses.map((bus, i) => (
          <BusRow
            key={bus.id}
            plate={bus.plate}
            direction={bus.direction}
            minutes={bus.minutes}
            full={bus.full}
          />
        ))}
        </ScrollView>
      </View>
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: "#2db54b",
    borderRadius: 20,
    overflow: "hidden",
  },
  rows: {
    padding: 20,
  },
});
