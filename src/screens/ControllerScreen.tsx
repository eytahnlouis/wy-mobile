import { login } from "../api/authService"; 
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
export default function ControllerScreen({ onClose }: { onClose: () => void }) {

  const handleLogout = async () => {  
    await login.logout();
    onClose();
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      backdropFilter: "blur(10px)",
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 20,
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: "#fff",
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#2db54b",
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controller Screen</Text>

      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.buttonText}>Mon Compte</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.buttonText}>Paramètres</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.buttonText}>Support</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}
