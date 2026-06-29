import { login } from "../api/authService";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { usePathname } from "expo-router";
export default function ControllerScreen({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await login.logout();
    onClose();
    router.replace("/login");
  };

  const handleNavigate = (route: string) => {
    onClose();
    router.push(route as never);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      justifyContent: "center",
    },
    menu: {
      backgroundColor: "transparent",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 20,
      maxHeight: "80%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#111111",
    },
    closeButton: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#999",
    },
    menuItem: {
      paddingVertical: 15,
      paddingHorizontal: 12,
      marginBottom: 8,
      backgroundColor: "#F5F5F5",
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    menuItemText: {
      fontSize: 16,
      fontWeight: "500",
      color: "#111111",
    },
    logoutItem: {
      backgroundColor: "#FFE5E5",
      marginTop: 15,
    },
    logoutText: {
      color: "#E74C3C",
      fontWeight: "600",
    },
    arrow: {
      fontSize: 18,
      color: "#27AE60",
    },
  });

  const DriverButton = () => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleNavigate("/driver")}
    >
      <Text style={styles.menuItemText}> Mode Conducteur</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  const PassengerButton = () => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleNavigate("/homepage")}
    >
      <Text style={styles.menuItemText}> Mode Passager</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {pathname !== "/driver" && <DriverButton />}
          {pathname !== "/homepage" && <PassengerButton />}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate("/profile")}
          >
            <Text style={styles.menuItemText}>👤 Mon Compte</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate("/settings")}
          >
            <Text style={styles.menuItemText}>⚙️ Paramètres</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate("/support")}
          >
            <Text style={styles.menuItemText}>❓ Support</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <Text style={[styles.menuItemText, styles.logoutText]}>
              🚪 Déconnexion
            </Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
