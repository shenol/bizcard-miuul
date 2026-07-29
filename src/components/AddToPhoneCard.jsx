import { useState } from "react";
import { WEBHOOK_URL } from "../lib/config.js";
import { buildVCard } from "../lib/vcard.js";

export function AddToPhoneCard({ profile, visitorName, visitorEmail, hasConsent }) {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleAddToPhone = async () => {
    const vcard = buildVCard(profile);
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Kişisel veri (ad/e-posta) yalnızca Gizlilik Politikası onaylandıysa iletilir.
    if (!hasConsent || !visitorName.trim() || !visitorEmail.trim()) return;

    setStatus("sending");
    try {
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
    }
  };

  return (
    <div className="form-card">
      <div className="form-title">Kartviziti Telefonuma Ekle</div>
      <div className="phone-description">
        Kartvizitimi rehberine ekle. Yukarıdaki bilgilerini de doldurduysan, sana ayrıca ulaşabiliriz.
      </div>

      <button className="phone-button" type="button" onClick={handleAddToPhone} disabled={status === "sending"}>
        {status === "sending" ? "Ekleniyor..." : "Telefonuma Ekle"}
      </button>

      <div className="phone-hint">Ad, e-posta ve telefonunu da yazarsan sana ayrıca ulaşabiliriz.</div>

      {status === "success" && (
        <div className="form-message success">Bilgilerin iletildi, teşekkürler!</div>
      )}
      {status === "error" && (
        <div className="form-message error">Bir şeyler ters gitti, lütfen tekrar deneyin.</div>
      )}
    </div>
  );
}
