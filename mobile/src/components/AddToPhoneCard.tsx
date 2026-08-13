import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// SDK 57's default `expo-contacts` export moved to a class-based API that isn't
// compatible with the function-based calls this component uses — import the
// legacy module on purpose, do not "fix" this back to `expo-contacts`.
import * as Contacts from "expo-contacts/legacy";
import { WEBHOOK_URL } from "../lib/config";
import { Profile } from "../data/profile";

type Status = "idle" | "sending" | "success" | "error" | "permission-denied";

export function AddToPhoneCard({
  profile,
  visitorName,
  visitorEmail,
  hasConsent,
}: {
  profile: Profile;
  visitorName: string;
  visitorEmail: string;
  hasConsent: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const isSubmittingRef = useRef(false);

  const handleAddToPhone = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      const { status: permissionStatus } = await Contacts.requestPermissionsAsync();
      if (permissionStatus !== "granted") {
        setStatus("permission-denied");
        return;
      }

      const phone = profile.contacts.find((c) => c.icon === "phone");
      const email = profile.contacts.find((c) => c.icon === "mail");
      const website = profile.contacts.find((c) => c.icon === "website");
      const [firstName, ...rest] = profile.name.split(" ");

      const contact: Contacts.Contact = {
        contactType: Contacts.ContactTypes.Person,
        name: profile.name,
        firstName,
        lastName: rest.join(" "),
        company: profile.company,
        jobTitle: profile.title,
        phoneNumbers: phone ? [{ label: "mobile", number: phone.href.replace("tel:", "") }] : [],
        emails: email ? [{ label: "work", email: email.href.replace("mailto:", "") }] : [],
        urlAddresses: website ? [{ label: "work", url: website.href }] : [],
      };

      await Contacts.addContactAsync(contact);

      if (!hasConsent || !visitorName.trim() || !visitorEmail.trim()) {
        setStatus("success");
        return;
      }

      setStatus("sending");
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "phone_contact_saved",
          name: visitorName,
          email: visitorEmail,
          cardOwner: profile.name,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("request failed");
      setStatus("success");
    } catch (error) {
      setStatus("error");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Kartviziti Telefonuma Ekle</Text>
      <Text style={styles.description}>
        Kartvizitimi rehberine ekle. Yukarıdaki bilgilerini de doldurduysan, sana ayrıca ulaşabiliriz.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleAddToPhone} disabled={status === "sending"}>
        <Text style={styles.buttonText}>{status === "sending" ? "Ekleniyor..." : "Telefonuma Ekle"}</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>Ad, e-posta ve telefonunu da yazarsan sana ayrıca ulaşabiliriz.</Text>

      {status === "success" && <Text style={styles.successMessage}>Rehberine eklendi, teşekkürler!</Text>}
      {status === "error" && <Text style={styles.errorMessage}>Bir şeyler ters gitti, lütfen tekrar deneyin.</Text>}
      {status === "permission-denied" && (
        <Text style={styles.errorMessage}>Rehbere eklemek için izin gerekiyor.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    gap: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#14213d",
    textAlign: "center",
  },
  description: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 18,
  },
  button: {
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#14213d",
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#14213d",
    fontSize: 14,
    fontWeight: "600",
  },
  hint: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
  successMessage: {
    fontSize: 13,
    color: "#15803d",
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 13,
    color: "#b91c1c",
    textAlign: "center",
  },
});
