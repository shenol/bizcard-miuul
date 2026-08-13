import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProfileCard } from "./src/components/ProfileCard";
import { CardQRCode } from "./src/components/CardQRCode";
import { PrivacyPolicyModal } from "./src/components/PrivacyPolicyModal";
import { profile } from "./src/data/profile";
import { buildMecard } from "./src/lib/vcard";

export default function App() {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileCard profile={profile} />

        <View style={styles.qrCard}>
          <Text style={styles.qrLabel}>Kartviziti telefonla taratın</Text>
          <CardQRCode value={buildMecard(profile)} size={140} />
        </View>

        <TouchableOpacity onPress={() => setIsPolicyOpen(true)}>
          <Text style={styles.footerLink}>Gizlilik Politikası</Text>
        </TouchableOpacity>

        <PrivacyPolicyModal open={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f6f8",
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
