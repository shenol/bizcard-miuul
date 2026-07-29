import { useState } from "react";
import { ProfileCard } from "./components/ProfileCard.jsx";
import { CardQRCode } from "./components/CardQRCode.jsx";
import { ContactForm } from "./components/ContactForm.jsx";
import { AddToPhoneCard } from "./components/AddToPhoneCard.jsx";
import { PrivacyPolicyModal } from "./components/PrivacyPolicyModal.jsx";
import { profile } from "./data/profile.js";

export function App() {
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  // Kart hangi adreste yayınlanıyorsa QR kodu o adresi işaret eder.
  const liveUrl = `${window.location.origin}${window.location.pathname}`;

  return (
    <>
      <ProfileCard profile={profile} />
      <div className="qr-card">
        <div className="qr-label">Kartviziti telefonla taratın</div>
        <CardQRCode value={liveUrl} size={140} />
      </div>
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

      <button className="footer-link" type="button" onClick={() => setIsPolicyOpen(true)}>
        Gizlilik Politikası
      </button>

      <PrivacyPolicyModal open={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
    </>
  );
}
