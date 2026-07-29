import { useState } from "react";
import { ProfileCard } from "./components/ProfileCard.jsx";
import { CardQRCode } from "./components/CardQRCode.jsx";
import { ContactForm } from "./components/ContactForm.jsx";
import { AddToPhoneCard } from "./components/AddToPhoneCard.jsx";
import { profile } from "./data/profile.js";

export function App() {
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");

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
      />
      <AddToPhoneCard profile={profile} visitorName={visitorName} visitorEmail={visitorEmail} />
    </>
  );
}
