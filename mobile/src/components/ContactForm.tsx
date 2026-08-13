import { useRef, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { WEBHOOK_URL } from "../lib/config";

type Action = "save_card" | "meeting_request";
type Status = "idle" | "sending" | "success" | "error";

const toLocalISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function ContactForm({
  cardOwner,
  name,
  email,
  onNameChange,
  onEmailChange,
  consentGiven,
  onConsentChange,
  onOpenPolicy,
}: {
  cardOwner: string;
  name: string;
  email: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  consentGiven: boolean;
  onConsentChange: (value: boolean) => void;
  onOpenPolicy: () => void;
}) {
  const [meetingDate, setMeetingDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [dateMissing, setDateMissing] = useState(false);
  const [fieldsMissing, setFieldsMissing] = useState(false);
  const [consentMissing, setConsentMissing] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [activeAction, setActiveAction] = useState<Action | null>(null);
  const isSubmittingRef = useRef(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (event.type === "set" && selectedDate) {
      setMeetingDate(selectedDate);
      setDateMissing(false);
    }
  };

  const submit = async (action: Action) => {
    if (isSubmittingRef.current) return;

    const missingBasics = !name.trim() || !email.trim();
    const missingDate = action === "meeting_request" && (!meetingDate || meetingDate < today);
    const missingConsent = !consentGiven;

    setFieldsMissing(missingBasics);
    setDateMissing(missingDate);
    setConsentMissing(missingConsent);
    if (missingBasics || missingDate || missingConsent) return;

    isSubmittingRef.current = true;
    setActiveAction(action);
    setStatus("sending");

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: action,
          name,
          email,
          meetingDate: action === "meeting_request" ? toLocalISODate(meetingDate!) : null,
          cardOwner,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("request failed");

      setStatus("success");
      onNameChange("");
      onEmailChange("");
      setMeetingDate(null);
    } catch (error) {
      setStatus("error");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Bize ulaşın</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Ad Soyad</Text>
        <TextInput
          style={[styles.input, fieldsMissing && styles.inputError]}
          value={name}
          onChangeText={(value) => {
            onNameChange(value);
            setFieldsMissing(false);
          }}
          placeholder="Adınız Soyadınız"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>E-posta</Text>
        <TextInput
          style={[styles.input, fieldsMissing && styles.inputError]}
          value={email}
          onChangeText={(value) => {
            onEmailChange(value);
            setFieldsMissing(false);
          }}
          placeholder="ornek@eposta.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {fieldsMissing && <Text style={styles.fieldError}>Ad soyad ve e-posta alanlarını doldurun.</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          Tercih Ettiğiniz Tarih <Text style={styles.hint}>(toplantı talebi için)</Text>
        </Text>
        <TouchableOpacity
          style={[styles.input, dateMissing && styles.inputError]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={meetingDate ? styles.dateText : styles.datePlaceholder}>
            {meetingDate ? meetingDate.toLocaleDateString("tr-TR") : "Tarih seçin"}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker value={meetingDate ?? today} mode="date" minimumDate={today} onChange={handleDateChange} />
        )}
        {dateMissing && (
          <Text style={styles.fieldError}>Toplantı talebi için bugün veya sonraki bir tarih seçmelisiniz.</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.consentField}
        onPress={() => {
          onConsentChange(!consentGiven);
          setConsentMissing(false);
        }}
      >
        <View style={[styles.checkbox, consentGiven && styles.checkboxChecked]}>
          {consentGiven && <Ionicons name="checkmark" size={14} color="#ffffff" />}
        </View>
        <Text style={styles.consentText}>
          <Text style={styles.link} onPress={onOpenPolicy}>
            Gizlilik Politikası
          </Text>{" "}
          kapsamında kişisel verilerimin işlenmesini kabul ediyorum.
        </Text>
      </TouchableOpacity>
      {consentMissing && (
        <Text style={styles.fieldError}>Devam etmek için Gizlilik Politikası'nı kabul etmelisiniz.</Text>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.submitButton} onPress={() => submit("save_card")} disabled={status === "sending"}>
          <Text style={styles.submitText}>
            {status === "sending" && activeAction === "save_card" ? "Gönderiliyor..." : "Kartı Kaydet"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => submit("meeting_request")}
          disabled={status === "sending"}
        >
          <Text style={styles.submitText}>
            {status === "sending" && activeAction === "meeting_request" ? "Gönderiliyor..." : "Toplantı Talep Et"}
          </Text>
        </TouchableOpacity>
      </View>

      {status === "success" && (
        <Text style={styles.successMessage}>
          {activeAction === "meeting_request" ? "Talebiniz alındı, teşekkürler!" : "Kaydedildi, teşekkürler!"}
        </Text>
      )}
      {status === "error" && <Text style={styles.errorMessage}>Bir şeyler ters gitti, lütfen tekrar deneyin.</Text>}
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
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: "#6b7280",
  },
  hint: {
    fontWeight: "400",
    color: "#9ca3af",
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    fontSize: 14,
    color: "#14213d",
    justifyContent: "center",
  },
  inputError: {
    borderColor: "#b91c1c",
  },
  dateText: {
    fontSize: 14,
    color: "#14213d",
  },
  datePlaceholder: {
    fontSize: 14,
    color: "#9ca3af",
  },
  fieldError: {
    fontSize: 12,
    color: "#b91c1c",
  },
  consentField: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9ca3af",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#14213d",
    borderColor: "#14213d",
  },
  consentText: {
    flex: 1,
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 17,
  },
  link: {
    color: "#14213d",
    textDecorationLine: "underline",
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#14213d",
    alignItems: "center",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
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
