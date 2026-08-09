import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import apiClient from "../api/client";

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "John Doe",
    email: "john@example.com",
    role: "Passager",
    licensePlate: null as string | null,
  });

  useEffect(() => {
    // Load user info from secure storage or API
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      await apiClient.get("/auth/user/").then((response) => {
        const data = response.data;
        setUserInfo({
          username: data.username,
          email: data.email,
          role: data.role === "1" ? "Passager" : "Conducteur",
          licensePlate: data.license_plate,
        });
      });
      // For now, we use placeholder data. Replace with actual API call.
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        // For now, use placeholder data
        setUserInfo({
          username: "John Doe",
          email: "john@example.com",
          role: "Passager",
          licensePlate: null,
        });
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger le profil");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call to update user profile
      await apiClient.put("/auth/user")
      Alert.alert("Succès", "Profil mis à jour");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#27AE60" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Mon Compte</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>
              {userInfo.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{userInfo.username}</Text>
          <Text style={styles.role}>{userInfo.role}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>

          <View style={styles.infoField}>
            <Text style={styles.label}>Nom d'utilisateur</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userInfo.username}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, username: text })
                }
                placeholder="Nom d'utilisateur"
              />
            ) : (
              <Text style={styles.value}>{userInfo.username}</Text>
            )}
          </View>

          <View style={styles.infoField}>
            <Text style={styles.label}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={userInfo.email}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, email: text })
                }
                placeholder="Email"
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.value}>{userInfo.email}</Text>
            )}
          </View>

          <View style={styles.infoField}>
            <Text style={styles.label}>Rôle</Text>
            <Text style={styles.value}>{userInfo.role}</Text>
          </View>

          {userInfo.licensePlate && (
            <View style={styles.infoField}>
              <Text style={styles.label}>Plaque d'immatriculation</Text>
              <Text style={styles.value}>{userInfo.licensePlate}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Modifier le profil</Text>
            </TouchableOpacity>
          )}
        </View>
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
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
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
  profileCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#27AE60",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 5,
  },
  role: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 15,
  },
  infoField: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: "#7F8C8D",
    fontWeight: "600",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#111111",
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  input: {
    fontSize: 16,
    color: "#111111",
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#27AE60",
  },
  actionButtons: {
    gap: 10,
    marginTop: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#27AE60",
  },
  saveButton: {
    backgroundColor: "#27AE60",
  },
  cancelButton: {
    backgroundColor: "#E74C3C",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
