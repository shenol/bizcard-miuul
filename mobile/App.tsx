import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ProfileCard } from "./src/components/ProfileCard";
import { CardQRCode } from "./src/components/CardQRCode";
import { ContactForm } from "./src/components/ContactForm";
import { AddToPhoneCard } from "./src/components/AddToPhoneCard";
import { PrivacyPolicyModal } from "./src/components/PrivacyPolicyModal";
import { profile } from "./src/data/profile";
import { buildMecard } from "./src/lib/vcard";

export default function App() {
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <ProfileCard profile={profile} />

            <View style={styles.qrCard}>
              <Text style={styles.qrLabel}>Kartviziti telefonla taratın</Text>
              <CardQRCode value={buildMecard(profile)} size={140} />
            </View>

            <ContactForm
              cardOwner={profile.name}
              name={visitorName}
              email={visitorEmail}
              onNameChange={setVisitorName}
              onEmailChange={setVisitorEmail}
              consentGiven={consentGiven}
              onConsentChange={setConsentGiven}
              onOpenPolicy={() => setIsPolicyOpen(true)}
            />

            <AddToPhoneCard
              profile={profile}
              visitorName={visitorName}
              visitorEmail={visitorEmail}
              hasConsent={consentGiven}
            />

            <TouchableOpacity onPress={() => setIsPolicyOpen(true)}>
              <Text style={styles.footerLink}>Gizlilik Politikası</Text>
            </TouchableOpacity>

            <PrivacyPolicyModal open={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  qrCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  qrLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  footerLink: {
    fontSize: 12,
    color: "#9ca3af",
    textDecorationLine: "underline",
  },
});
