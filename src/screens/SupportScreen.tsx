import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {supportService} from "../api/supportService";

export default function SupportScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      await supportService.submitIssue({ subject : subject, description: message });
      console.log("Support message:", { subject, message });

      Alert.alert(
        "Succès",
        "Votre message a été envoyé. Nous vous répondrons bientôt.",
      );
      setSubject("");
      setMessage("");
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible d'envoyer le message. Veuillez réessayer.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSupport = () => {
    const email = "support@wy-app.com";
    // TODO: Replace with actual support email
    const subject = encodeURIComponent("Support wy@");
    const body = encodeURIComponent(
      "Bonjour,\n\nJ'ai besoin d'aide avec...\n\nMerci",
    );
    const url = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Erreur", "Email client non disponible");
        }
      })
      .catch(() => Alert.alert("Erreur", "Email client non disponible"));
  };

  const handleCallSupport = () => {
    // TODO: Replace with actual support phone number
    const phone = "+33123456789";
    const url = `tel:${phone}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Erreur", "Appel non disponible");
        }
      })
      .catch(() => Alert.alert("Erreur", "Appel non disponible"));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Support</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions Fréquentes</Text>
          <FAQItem
            question="Comment puis-je changer mon mot de passe ?"
            answer="Accédez à vos paramètres de compte et sélectionnez 'Changer le mot de passe'."
          />
          <FAQItem
            question="Comment puis-je signaler un problème ?"
            answer="Utilisez le formulaire de contact ci-dessous ou appelez-nous directement."
          />
          <FAQItem
            question="Quel est le délai de réponse ?"
            answer="Nous répondons généralement dans les 24 heures."
          />
        </View>

        {/* Quick Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Rapide</Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleEmailSupport}
          >
            <Text style={styles.contactButtonText}>📧 Email Support</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contactButton, styles.phoneButton]}
            onPress={handleCallSupport}
          >
            <Text style={styles.contactButtonText}>📞 Appeler Support</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Form Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Formulaire de Contact</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Sujet</Text>
            <TextInput
              style={styles.input}
              placeholder="Décrivez brièvement votre problème"
              placeholderTextColor="#999"
              value={subject}
              onChangeText={setSubject}
              editable={!loading}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Détails supplémentaires..."
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              editable={!loading}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Envoyer le Message</Text>
            )}
          </TouchableOpacity>
        </View>


        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.faqQuestionText}>{question}</Text>
        <Text style={styles.faqIcon}>{expanded ? "−" : "+"}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{answer}</Text>
        </View>
      )}
    </View>
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
  faqItem: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
    flex: 1,
  },
  faqIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27AE60",
    width: 30,
    textAlign: "right",
  },
  faqAnswer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  faqAnswerText: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 20,
  },
  contactButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#27AE60",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  phoneButton: {
    backgroundColor: "#3498DB",
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    fontSize: 16,
    color: "#111111",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  messageInput: {
    height: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    paddingVertical: 14,
    backgroundColor: "#27AE60",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  infoBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#27AE60",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 4,
  },
  footer: {
    height: 20,
  },
});
