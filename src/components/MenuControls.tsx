import { TouchableOpacity, View, StyleSheet } from "react-native";

type HamburgerProps = {
  onPress: () => void;
  open?: boolean;
};

export function HamburgerButton({ onPress, open = false }: HamburgerProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View style={styles.line} />
      <View style={styles.line} />
      <View style={[styles.line, { width: open ? 24 : 16 }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2db54b",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  line: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
});
