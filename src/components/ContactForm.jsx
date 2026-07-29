import { useRef, useState } from "react";
import { WEBHOOK_URL } from "../lib/config.js";

export function ContactForm({
  cardOwner,
  name,
  email,
  onNameChange,
  onEmailChange,
  consentGiven,
  onConsentChange,
  onOpenPolicy,
}) {
  const [meetingDate, setMeetingDate] = useState("");
  const [dateMissing, setDateMissing] = useState(false);
  const [fieldsMissing, setFieldsMissing] = useState(false);
  const [consentMissing, setConsentMissing] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [activeAction, setActiveAction] = useState(null); // "save_card" | "meeting_request"
  const isSubmittingRef = useRef(false);

  const todayISO = new Date().toISOString().split("T")[0];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;

    const action = event.nativeEvent.submitter.value;

    const missingBasics = !name.trim() || !email.trim();
    const missingDate = action === "meeting_request" && (!meetingDate || meetingDate < todayISO);
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
          meetingDate: action === "meeting_request" ? meetingDate : null,
          cardOwner,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("request failed");

      setStatus("success");
      onNameChange("");
      onEmailChange("");
      setMeetingDate("");
    } catch (error) {
      setStatus("error");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-title">Bize ulaşın</div>

      <div className="form-field">
        <label htmlFor="visitor-name">Ad Soyad</label>
        <input
          id="visitor-name"
          type="text"
          value={name}
          onChange={(event) => {
            onNameChange(event.target.value);
            setFieldsMissing(false);
          }}
          placeholder="Adınız Soyadınız"
          className={fieldsMissing ? "input-error" : ""}
        />
      </div>

      <div className="form-field">
        <label htmlFor="visitor-email">E-posta</label>
        <input
          id="visitor-email"
          type="email"
          value={email}
          onChange={(event) => {
            onEmailChange(event.target.value);
            setFieldsMissing(false);
          }}
          placeholder="ornek@eposta.com"
          className={fieldsMissing ? "input-error" : ""}
        />
        {fieldsMissing && (
          <div className="field-error">Ad soyad ve e-posta alanlarını doldurun.</div>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="meeting-date">
          Tercih Ettiğiniz Tarih <span className="form-hint">(toplantı talebi için)</span>
        </label>
        <input
          id="meeting-date"
          type="date"
          value={meetingDate}
          min={todayISO}
          onChange={(event) => {
            setMeetingDate(event.target.value);
            setDateMissing(false);
          }}
          className={dateMissing ? "input-error" : ""}
        />
        {dateMissing && (
          <div className="field-error">Toplantı talebi için bugün veya sonraki bir tarih seçmelisiniz.</div>
        )}
      </div>

      <label className="consent-field">
        <input
          type="checkbox"
          checked={consentGiven}
          onChange={(event) => {
            onConsentChange(event.target.checked);
            setConsentMissing(false);
          }}
        />
        <span>
          <button type="button" className="link-button" onClick={onOpenPolicy}>
            Gizlilik Politikası
          </button>{" "}
          kapsamında kişisel verilerimin işlenmesini kabul ediyorum.
        </span>
      </label>
      {consentMissing && (
        <div className="field-error">Devam etmek için Gizlilik Politikası'nı kabul etmelisiniz.</div>
      )}

      <div className="form-buttons">
        <button
          className="form-submit"
          type="submit"
          name="action"
          value="save_card"
          disabled={status === "sending"}
        >
          {status === "sending" && activeAction === "save_card" ? "Gönderiliyor..." : "Kartı Kaydet"}
        </button>
        <button
          className="form-submit"
          type="submit"
          name="action"
          value="meeting_request"
          disabled={status === "sending"}
        >
          {status === "sending" && activeAction === "meeting_request" ? "Gönderiliyor..." : "Toplantı Talep Et"}
        </button>
      </div>

      {status === "success" && (
        <div className="form-message success">
          {activeAction === "meeting_request" ? "Talebiniz alındı, teşekkürler!" : "Kaydedildi, teşekkürler!"}
        </div>
      )}
      {status === "error" && (
        <div className="form-message error">Bir şeyler ters gitti, lütfen tekrar deneyin.</div>
      )}
    </form>
  );
}
