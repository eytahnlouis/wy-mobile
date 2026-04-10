import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { login } from "../api/authService";
import { Checkbox } from "expo-checkbox";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDriver, setisDriver] = useState(false); // 1 pour passager, 2 pour conducteur

  const handleRegister = async () => {
    setLoading(true);
    try {
      await login.register({
        username,
        email,
        password,
        isDriver: isDriver,
        license_plate: isDriver === true ? licensePlate : "",
      });
      // Navigation vers l'écran principal après une connexion réussie
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Erreur de connexion",
        "Veuillez vérifier vos identifiants et réessayer.",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.logo}>wy@</Text>
        <Text style={styles.subtitle}>Votre trajet en temps réel</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            placeholderTextColor="#ccc"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Text>
            Êtes-vous conducteur ? Si oui, veuillez entrer votre plaque
            d&apos;immatriculation. Sinon, laissez ce champ vide.
          </Text>
          <Checkbox
            value={isDriver === false}
            onValueChange={(newValue) => setisDriver(newValue ? true : false)}
            color={isDriver === true ? "#27AE60" : undefined}
          />
          {isDriver === true && (
            <TextInput
              style={styles.input}
              placeholder="Plaque d'immatriculation"
              placeholderTextColor="#ccc"
              value={licensePlate}
              onChangeText={setLicensePlate}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>S&apos;inscrire</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.footerText}>
            Vous avez déjà un compte ?{" "}
            <Text style={styles.greenText}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#3DA532",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#27AE60", // Ton vert "wy@"
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#696262",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#27AE60",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 20,
    color: "#34495E",
  },
  greenText: {
    color: "#27AE60",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
