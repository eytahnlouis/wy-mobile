// components/BusRow.tsx
import { View, Text, StyleSheet } from "react-native";
import { useFonts } from "expo-font";

type BusRowProps = {
  plate: string;
  direction: string;
  minutes: number;
  full?: boolean;
};


export function BusRow({
  plate,
  direction,
  minutes,
  full = false,
}: BusRowProps) {
  const timeColor =
    minutes <= 10 ? "#fff" : minutes <= 20 ? "#f59e0b" : "#f97316";

  const [fontsLoaded] = useFonts({
    "ZenDots-Regular": require("@/assets/fonts/ZenDots-Regular.ttf"), // Font pour les plaques d'immatriculation
    "MPLUS1p-Bold": require("@/assets/fonts/MPLUS1p-Bold.ttf"), // Font pour les minutes et les directions
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.row}>
      <View>
        {full && <Text style={styles.fullLabel}>PLEIN!</Text>}
        <Text style={[styles.plate, full && styles.plateFull]}>{plate}</Text>
        <Text style={[styles.direction, full && styles.directionFull]}>
          {direction}
        </Text>
      </View>
      <Text style={[styles.time, { color: timeColor }]}>{minutes}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },
  fullLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ef4444",
    letterSpacing: 1,
    marginBottom: 4,
  },
  plate: {
    fontSize: 22,
    fontWeight: "500",
    color: "#fff",
    letterSpacing: 1,
    fontFamily: "ZenDots-Regular",
  },
  plateFull: {
    color: "rgba(255,255,255,0.4)",
    textDecorationLine: "line-through",
  },
  direction: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 1,
    marginTop: 4,
    fontFamily: "MPLUS1p-Bold",
  },
  directionFull: {
    color: "rgba(255,255,255,0.4)",
  },
  time: {
    fontSize: 36,
    fontWeight: "500",
    fontFamily: "MPLUS1p-Bold",
  },
});
