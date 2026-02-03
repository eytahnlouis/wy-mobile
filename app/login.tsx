import React, { useState } from "react";
import { useFonts } from "expo-font";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { login } from "../src/api/authService";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [loaded] = useFonts({
    KonkhmerSleokchher: require("@/assets/fonts/KonkhmerSleokchher-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      await login.login({ email, password });
      router.replace("/(tabs)");
    } catch {
      Alert.alert(
        "Erreur de connexion",
        "Veuillez vérifier vos identifiants et réessayer.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>wy@</Text>
        <Text style={styles.subtitle}>Votre trajet en temps réel</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Plaque ou nom d'utilisateur"
            placeholderTextColor="#696262"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#696262"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}> → </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.footerText}>
            Pas encore de compte ?{" "}
            <Text style={styles.greenText}>S&apos;inscrire</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#61a817",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
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
    alignItems: "center",
  },
  input: {
    width: "85%",
    height: 50,
    backgroundColor: "#F2F2F2",
    borderRadius: 25,
    paddingHorizontal: 15,
    alignSelf: "center",
    marginBottom: 50,
    fontSize: 14,
    color: "#D9D9D9",
    fontFamily: "KonkhmerSleokchher",

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,

    // Android
    elevation: 4,
  },
  button: {
    width: "25%",
    height: 55,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#95D5B2",
  },
  buttonText: {
    color: "#000000",
    fontSize: 40,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 20,
    color: "#e0e3e7",
  },
  greenText: {
    color: "#000000",
    fontWeight: "bold",
  },
});