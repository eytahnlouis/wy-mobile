import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
    darkMode: false,
    dataCollection: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    // TODO: Save to local storage or API
  };

  const handleClearCache = () => {
    Alert.alert("Vider le cache", "Êtes-vous sûr ?", [
      { text: "Annuler", onPress: () => {}, style: "cancel" },
      {
        text: "Vider",
        onPress: () => {
          // TODO: Implement cache clearing
          Alert.alert("Succès", "Cache vidé");
        },
        style: "destructive",
      },
    ]);
  };

  const handlePrivacy = () => {
    // TODO: Replace with actual URL
    Linking.openURL("https://example.com/privacy");
  };

  const handleTerms = () => {
    // TODO: Replace with actual URL
    Linking.openURL("https://example.com/terms");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Paramètres</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Notifications push</Text>
            <Switch
              value={settings.notifications}
              onValueChange={() => toggleSetting("notifications")}
              trackColor={{ false: "#D9D9D9", true: "#95D5B2" }}
              thumbColor={settings.notifications ? "#27AE60" : "#696262"}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confidentialité & Données</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Suivi de localisation</Text>
            <Switch
              value={settings.locationTracking}
              onValueChange={() => toggleSetting("locationTracking")}
              trackColor={{ false: "#D9D9D9", true: "#95D5B2" }}
              thumbColor={settings.locationTracking ? "#27AE60" : "#696262"}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Collecte de données</Text>
            <Switch
              value={settings.dataCollection}
              onValueChange={() => toggleSetting("dataCollection")}
              trackColor={{ false: "#D9D9D9", true: "#95D5B2" }}
              thumbColor={settings.dataCollection ? "#27AE60" : "#696262"}
            />
          </View>
        </View>

        {/* Display Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Affichage</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Mode sombre</Text>
            <Switch
              value={settings.darkMode}
              onValueChange={() => toggleSetting("darkMode")}
              trackColor={{ false: "#D9D9D9", true: "#95D5B2" }}
              thumbColor={settings.darkMode ? "#27AE60" : "#696262"}
            />
          </View>
        </View>

        {/* Storage Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stockage</Text>
          <TouchableOpacity style={styles.button} onPress={handleClearCache}>
            <Text style={styles.buttonText}>Vider le cache</Text>
          </TouchableOpacity>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Légal</Text>
          <TouchableOpacity style={styles.linkRow} onPress={handlePrivacy}>
            <Text style={styles.linkText}>Politique de confidentialité</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={handleTerms}>
            <Text style={styles.linkText}>Conditions d'utilisation</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Numéro de build</Text>
            <Text style={styles.aboutValue}>1</Text>
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: "#27AE60",
    fontWeight: "bold",
    width: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111111",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7F8C8D",
    textTransform: "uppercase",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: "#111111",
    fontWeight: "500",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#E74C3C",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    color: "#27AE60",
    fontWeight: "500",
  },
  arrow: {
    fontSize: 20,
    color: "#27AE60",
    fontWeight: "bold",
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 10,
  },
  aboutLabel: {
    fontSize: 16,
    color: "#111111",
    fontWeight: "500",
  },
  aboutValue: {
    fontSize: 16,
    color: "#7F8C8D",
  },
  footer: {
    height: 20,
  },
});
