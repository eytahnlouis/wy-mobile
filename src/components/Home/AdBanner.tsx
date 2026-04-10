// components/AdBanner.tsx
import { View, Text, StyleSheet } from "react-native";

export function AdBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>PUB.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#27a244",
    paddingVertical: 16,
    alignItems: "center",
  },
  text: {
    fontSize: 22,
    fontWeight: "500",
    color: "#fff",
    letterSpacing: 2,
  },
});
