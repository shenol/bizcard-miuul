# BizCard Expo Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the BizCard digital business card as an Expo (React Native, TypeScript) app that runs in Expo Go, replacing the Vite/web app as the active product.

**Architecture:** A new standalone Expo TypeScript project under `mobile/` with a single-screen app (no navigation library). Components are ported 1:1 from the existing web app (`src/components/*.jsx`) to React Native equivalents, built up incrementally and wired into `App.tsx` one feature slice at a time so each task ends with something runnable in Expo Go.

**Tech Stack:** Expo SDK (TypeScript template), `expo-contacts`, `react-native-qrcode-svg` + `react-native-svg`, `@react-native-community/datetimepicker`, `@expo/vector-icons` (bundled with Expo).

**Spec:** `docs/superpowers/specs/2026-08-13-expo-migration-design.md`

## Global Constraints

- Must run unmodified in the standard **Expo Go** app — no custom native modules, no `expo-dev-client`, no EAS Build required.
- New project lives entirely under `mobile/` with its own `package.json`; the existing `src/`, `index.html`, `vite.config.js` at the repo root are left untouched.
- TypeScript throughout (Expo's `blank-typescript` template), one function component per file.
- Webhook URL is `https://n8n.rmhy.net/webhook/biz-card`, reused unchanged.
- JSON payload shapes must match the **current live web app** exactly (`src/components/ContactForm.jsx` and `AddToPhoneCard.jsx`), not the stale contract described in the `bizcard-conventions` skill:
  - `save_card` / `meeting_request`: `{ type, name, email, meetingDate, cardOwner, submittedAt }`
  - Add-to-phone: `{ type: "phone_contact_saved", name, email, cardOwner, submittedAt }`
- Color palette (carried over from `src/index.css`): primary `#14213d`, muted text `#6b7280`, background `#f4f6f8`, border `#e5e7eb`, error `#b91c1c`, success `#15803d`.
- No automated test framework is introduced (none exists in the current project). Verification is manual, in Expo Go, per task.
- Demo data only — no real personal contact info (matches project `CLAUDE.md`).

---

## Task 1: Scaffold the Expo project

**Files:**
- Create: `mobile/` (full Expo TypeScript project via `create-expo-app`)
- Modify: `mobile/app.json` (app name/slug)

**Interfaces:**
- Produces: a bootable Expo project at `mobile/` with `npx expo start` working, ready for subsequent tasks to add `src/`.

- [ ] **Step 1: Scaffold the project**

Run from the repo root:

```bash
npx create-expo-app@latest mobile --template blank-typescript
```

- [ ] **Step 2: Install feature dependencies**

```bash
cd mobile
npx expo install react-native-svg @react-native-community/datetimepicker expo-contacts
npm install react-native-qrcode-svg
```

`@expo/vector-icons` ships as a dependency of the `expo` package already — no separate install needed.

- [ ] **Step 3: Set the app name and slug**

Edit `mobile/app.json`, set:
```json
{
  "expo": {
    "name": "BizCard",
    "slug": "bizcard-miuul"
  }
}
```
(Keep all other scaffold-generated fields as-is.)

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit` (from inside `mobile/`)
Expected: no errors.

- [ ] **Step 5: Verify it boots in Expo Go**

Run: `npx expo start`
Expected: a QR code appears in the terminal; scanning it with the Expo Go app on a phone (or pressing `i`/`a` for a simulator/emulator) shows the default scaffold screen with no red-screen errors. Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 6: Commit**

```bash
git add mobile
git commit -m "Scaffold Expo TypeScript project for BizCard mobile app"
```

---

## Task 2: Profile data + Profile card UI

**Files:**
- Create: `mobile/src/data/profile.ts`
- Create: `mobile/src/components/Avatar.tsx`
- Create: `mobile/src/components/ContactList.tsx`
- Create: `mobile/src/components/ProfileCard.tsx`
- Modify: `mobile/App.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks beyond the scaffold from Task 1.
- Produces:
  - `export interface ContactItem { icon: "phone" | "mail" | "website" | "linkedin" | "instagram"; label: string; href: string; external?: boolean }` (`data/profile.ts`)
  - `export interface Profile { initials: string; name: string; title: string; company: string; contacts: ContactItem[]; socials: ContactItem[] }` (`data/profile.ts`)
  - `export const profile: Profile` (`data/profile.ts`) — consumed by every later task
  - `export function Avatar({ initials }: { initials: string }): JSX.Element`
  - `export function ContactList({ items, variant }: { items: ContactItem[]; variant?: "rows" | "icons" }): JSX.Element`
  - `export function ProfileCard({ profile }: { profile: Profile }): JSX.Element` — consumed by `App.tsx`

- [ ] **Step 1: Write the profile data module**

Create `mobile/src/data/profile.ts`:

```ts
export interface ContactItem {
  icon: "phone" | "mail" | "website" | "linkedin" | "instagram";
  label: string;
  href: string;
  external?: boolean;
}

export interface Profile {
  initials: string;
  name: string;
  title: string;
  company: string;
  contacts: ContactItem[];
  socials: ContactItem[];
}

export const profile: Profile = {
  initials: "SH",
  name: "Shenol Mustafa",
  title: "Co-founder",
  company: "LTS CONSULTING",
  contacts: [
    { icon: "phone", label: "+90 537 659 44 99", href: "tel:+905376594499" },
    { icon: "mail", label: "shenol@lts.bg", href: "mailto:shenol@lts.bg" },
    { icon: "website", label: "www.lts.bg", href: "https://www.lts.bg", external: true },
  ],
  socials: [
    { icon: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/shenol" },
    { icon: "instagram", label: "Instagram", href: "https://www.instagram.com/shenol" },
  ],
};
```

- [ ] **Step 2: Write the Avatar component**

Create `mobile/src/components/Avatar.tsx`:

```tsx
import { StyleSheet, Text, View } from "react-native";

export function Avatar({ initials }: { initials: string }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#14213d",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  initials: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
```

- [ ] **Step 3: Write the ContactList component**

Create `mobile/src/components/ContactList.tsx`:

```tsx
import { Ionicons } from "@expo/vector-icons";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ContactItem } from "../data/profile";

const ICON_NAMES: Record<ContactItem["icon"], keyof typeof Ionicons.glyphMap> = {
  phone: "call",
  mail: "mail",
  website: "globe-outline",
  linkedin: "logo-linkedin",
  instagram: "logo-instagram",
};

export function ContactList({
  items,
  variant = "rows",
}: {
  items: ContactItem[];
  variant?: "rows" | "icons";
}) {
  if (variant === "icons") {
    return (
      <View style={styles.socials}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.socialButton}
            onPress={() => Linking.openURL(item.href)}
            accessibilityLabel={item.label}
          >
            <Ionicons name={ICON_NAMES[item.icon]} size={18} color="#14213d" />
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.contact}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={styles.contactRow}
          onPress={() => Linking.openURL(item.href)}
        >
          <Ionicons name={ICON_NAMES[item.icon]} size={20} color="#14213d" />
          <Text style={styles.contactLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  contact: {
    gap: 14,
    marginBottom: 28,
    width: "100%",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactLabel: {
    color: "#14213d",
    fontSize: 14,
  },
  socials: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f4f6f8",
    alignItems: "center",
    justifyContent: "center",
  },
});
```

- [ ] **Step 4: Write the ProfileCard component**

Create `mobile/src/components/ProfileCard.tsx`:

```tsx
import { StyleSheet, Text, View } from "react-native";
import { Profile } from "../data/profile";
import { Avatar } from "./Avatar";
import { ContactList } from "./ContactList";

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <View style={styles.card}>
      <Avatar initials={profile.initials} />
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.title}>{profile.title}</Text>
      <Text style={styles.company}>{profile.company}</Text>
      <View style={styles.divider} />
      <ContactList items={profile.contacts} />
      <ContactList items={profile.socials} variant="icons" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#14213d",
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    color: "#14213d",
    opacity: 0.75,
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#e5e7eb",
    marginBottom: 24,
  },
});
```

- [ ] **Step 5: Wire ProfileCard into App.tsx**

Replace the contents of `mobile/App.tsx`:

```tsx
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { ProfileCard } from "./src/components/ProfileCard";
import { profile } from "./src/data/profile";

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileCard profile={profile} />
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
});
```

- [ ] **Step 6: Verify TypeScript compiles**

Run (from `mobile/`): `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Verify in Expo Go**

Run: `npx expo start`, open in Expo Go.
Expected: a white card showing the "SH" avatar circle, "Shenol Mustafa" / "Co-founder" / "LTS CONSULTING", a divider, then three contact rows (phone/mail/website) and two social icon buttons (LinkedIn/Instagram). Tapping a contact row or social icon opens the corresponding phone/mail/browser app. Stop the dev server once confirmed.

- [ ] **Step 8: Commit**

```bash
git add mobile
git commit -m "Add profile card UI (Avatar, ContactList, ProfileCard) to Expo app"
```

---

## Task 3: QR code (MECARD)

**Files:**
- Create: `mobile/src/lib/vcard.ts`
- Create: `mobile/src/components/CardQRCode.tsx`
- Modify: `mobile/App.tsx`

**Interfaces:**
- Consumes: `Profile` type and `profile` value from `src/data/profile.ts` (Task 2).
- Produces:
  - `export function buildMecard(profile: Profile): string` (`lib/vcard.ts`) — consumed by `App.tsx` (this task) and potentially reused later
  - `export function CardQRCode({ value, size }: { value: string; size?: number }): JSX.Element` — consumed by `App.tsx`

- [ ] **Step 1: Write the MECARD builder**

Create `mobile/src/lib/vcard.ts`:

```ts
import { Profile } from "../data/profile";

export function buildMecard(profile: Profile): string {
  const phone = profile.contacts.find((c) => c.icon === "phone");
  const email = profile.contacts.find((c) => c.icon === "mail");
  const website = profile.contacts.find((c) => c.icon === "website");
  const [firstName, ...rest] = profile.name.split(" ");
  const lastName = rest.join(" ");

  const parts = [`N:${lastName},${firstName}`, `ORG:${profile.company}`];
  if (phone) parts.push(`TEL:${phone.href.replace("tel:", "")}`);
  if (email) parts.push(`EMAIL:${email.href.replace("mailto:", "")}`);
  if (website) parts.push(`URL:${website.href}`);

  return `MECARD:${parts.join(";")};;`;
}
```

- [ ] **Step 2: Write the CardQRCode component**

Create `mobile/src/components/CardQRCode.tsx`:

```tsx
import QRCode from "react-native-qrcode-svg";
import { StyleSheet, View } from "react-native";

export function CardQRCode({ value, size = 140 }: { value: string; size?: number }) {
  return (
    <View style={styles.qrCode}>
      <QRCode value={value} size={size} color="#14213d" backgroundColor="#ffffff" />
    </View>
  );
}

const styles = StyleSheet.create({
  qrCode: {
    borderRadius: 8,
    overflow: "hidden",
  },
});
```

- [ ] **Step 3: Wire the QR card into App.tsx**

Update `mobile/App.tsx` — add the import and the QR card block between `<ProfileCard .../>` and the closing `</ScrollView>`:

```tsx
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { ProfileCard } from "./src/components/ProfileCard";
import { CardQRCode } from "./src/components/CardQRCode";
import { profile } from "./src/data/profile";
import { buildMecard } from "./src/lib/vcard";

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileCard profile={profile} />

        <View style={styles.qrCard}>
          <Text style={styles.qrLabel}>Kartviziti telefonla taratın</Text>
          <CardQRCode value={buildMecard(profile)} size={140} />
        </View>
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
});
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Verify in Expo Go**

Run: `npx expo start`, open in Expo Go.
Expected: below the profile card, a second white card labeled "Kartviziti telefonla taratın" shows a QR code. Scan it with a phone's camera app (a second, separate phone/device, not the one running Expo Go) — it should prompt to add a new contact named "Shenol Mustafa" with the demo phone/email/company. Stop the dev server once confirmed.

- [ ] **Step 6: Commit**

```bash
git add mobile
git commit -m "Add MECARD QR code to Expo app"
```

---

## Task 4: Privacy Policy modal

**Files:**
- Create: `mobile/src/components/PrivacyPolicyModal.tsx`
- Modify: `mobile/App.tsx`

**Interfaces:**
- Consumes: `profile` from `src/data/profile.ts` (Task 2).
- Produces: `export function PrivacyPolicyModal({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element` — consumed by `App.tsx`.

- [ ] **Step 1: Write the PrivacyPolicyModal component**

Create `mobile/src/components/PrivacyPolicyModal.tsx`:

```tsx
import { Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { profile } from "../data/profile";

export function PrivacyPolicyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const email = profile.contacts.find((c) => c.icon === "mail");

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} accessibilityLabel="Kapat">
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
          <ScrollView>
            <Text style={styles.title}>Kişisel Verilerin Korunması Aydınlatma Metni</Text>
            <Text style={styles.updated}>Son güncelleme: 29 Temmuz 2026</Text>

            <Text style={styles.heading}>1. Veri Sorumlusu</Text>
            <Text style={styles.paragraph}>
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, bu dijital
              kartvizit üzerinden paylaştığınız kişisel verileriniz, veri sorumlusu sıfatıyla{" "}
              {profile.name} ({profile.company}) tarafından aşağıda açıklanan kapsam ve
              amaçlarla işlenmektedir.
            </Text>

            <Text style={styles.heading}>2. İşlenen Kişisel Veriler</Text>
            <Text style={styles.paragraph}>
              Bu sayfadaki formları doldurmanız hâlinde aşağıdaki kişisel verileriniz işlenir:
            </Text>
            <Text style={styles.listItem}>• Ad Soyad</Text>
            <Text style={styles.listItem}>• E-posta adresi</Text>
            <Text style={styles.listItem}>• Toplantı talebinde bulunmanız hâlinde tercih ettiğiniz tarih</Text>
            <Text style={styles.paragraph}>
              Kartviziti telefonunuza eklediğinizde eklenen kişi, yalnızca kartvizit
              sahibinin kendi iletişim bilgilerini içerir; bu işlemin tek başına
              gerçekleştirilmesi hâlinde sizin herhangi bir kişisel veriniz işlenmez.
            </Text>

            <Text style={styles.heading}>3. İşleme Amaçları</Text>
            <Text style={styles.paragraph}>
              Kişisel verileriniz; sizinle iletişime geçilmesi, ilettiğiniz toplantı
              talebinin değerlendirilmesi ve planlanması, ve talep etmeniz hâlinde
              kartvizit sahibinin size ayrıca ulaşabilmesi amaçlarıyla sınırlı olarak
              işlenir.
            </Text>

            <Text style={styles.heading}>4. Hukuki Sebep</Text>
            <Text style={styles.paragraph}>
              Kişisel verileriniz, KVKK'nın 5. maddesi uyarınca açık rızanıza dayanılarak
              işlenmektedir. Formu göndermeden önce onayınız ayrıca alınır.
            </Text>

            <Text style={styles.heading}>5. Kişisel Verilerin Aktarılması</Text>
            <Text style={styles.paragraph}>
              Gönderdiğiniz veriler, formu işleme almak amacıyla kullanılan bir otomasyon/
              entegrasyon hizmeti (webhook) aracılığıyla ilgili üçüncü taraf sunucuya iletilir.
              Bu sunucu yurt içinde veya yurt dışında barındırılabilir. Veriler, açık
              rızanız kapsamında ve yalnızca yukarıda belirtilen amaçlarla aktarılır;
              reklam, pazarlama veya analiz amacıyla başka bir üçüncü tarafla
              paylaşılmaz.
            </Text>

            <Text style={styles.heading}>6. Saklama Süresi</Text>
            <Text style={styles.paragraph}>
              Kişisel verileriniz, talebinizin sonuçlandırılması için gerekli süre
              boyunca ve ilgili mevzuattaki zamanaşımı süreleri saklı kalmak kaydıyla en
              fazla 1 yıl saklanır; bu sürenin sonunda silinir veya anonim hâle
              getirilir.
            </Text>

            <Text style={styles.heading}>7. KVKK Madde 11 Kapsamındaki Haklarınız</Text>
            <Text style={styles.paragraph}>
              İlgili kişi olarak KVKK'nın 11. maddesi uyarınca şu haklara sahipsiniz:
            </Text>
            <Text style={styles.listItem}>• Kişisel verinizin işlenip işlenmediğini öğrenme,</Text>
            <Text style={styles.listItem}>• İşlenmişse buna ilişkin bilgi talep etme,</Text>
            <Text style={styles.listItem}>
              • İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,
            </Text>
            <Text style={styles.listItem}>• Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</Text>
            <Text style={styles.listItem}>• Eksik veya yanlış işlenmişse düzeltilmesini isteme,</Text>
            <Text style={styles.listItem}>
              • KVKK'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,
            </Text>
            <Text style={styles.listItem}>
              • Bu işlemlerin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,
            </Text>
            <Text style={styles.listItem}>
              • İşlenen verilerin analizi sonucu aleyhinize bir sonuç çıkmasına itiraz etme,
            </Text>
            <Text style={styles.listItem}>
              • Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme.
            </Text>

            <Text style={styles.heading}>8. Başvuru</Text>
            <Text style={styles.paragraph}>
              Yukarıdaki haklarınızı kullanmak için{" "}
              {email ? (
                <Text style={styles.link} onPress={() => Linking.openURL(email.href)}>
                  {email.label}
                </Text>
              ) : (
                "iletişim bilgilerimiz üzerinden"
              )}{" "}
              bizimle iletişime geçebilirsiniz.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(20, 33, 61, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 28,
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f4f6f8",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  closeText: {
    color: "#14213d",
    fontSize: 16,
    lineHeight: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#14213d",
    marginBottom: 4,
    paddingRight: 20,
  },
  updated: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 16,
  },
  heading: {
    fontSize: 14,
    fontWeight: "600",
    color: "#14213d",
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 19,
    marginBottom: 4,
  },
  listItem: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 19,
    marginLeft: 8,
  },
  link: {
    color: "#14213d",
    textDecorationLine: "underline",
  },
});
```

- [ ] **Step 2: Wire the modal and footer link into App.tsx**

Update `mobile/App.tsx`:

```tsx
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
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Verify in Expo Go**

Run: `npx expo start`, open in Expo Go.
Expected: a "Gizlilik Politikası" link appears below the QR card. Tapping it opens a modal with the KVKK text, scrollable, with a working "×" close button and tapping outside... (the modal has no backdrop-tap-to-close in this port — closing is via the × button only, same as an acceptable RN pattern). Confirm the modal opens and the × closes it. Stop the dev server once confirmed.

- [ ] **Step 5: Commit**

```bash
git add mobile
git commit -m "Add Privacy Policy modal to Expo app"
```

---

## Task 5: Contact form ("Kartı Kaydet" / "Toplantı Talep Et")

**Files:**
- Create: `mobile/src/lib/config.ts`
- Create: `mobile/src/components/ContactForm.tsx`
- Modify: `mobile/App.tsx`

**Interfaces:**
- Consumes: nothing beyond React Native/Expo primitives and `@expo/vector-icons` (already available from Task 2).
- Produces:
  - `export const WEBHOOK_URL: string` (`lib/config.ts`) — consumed by `ContactForm.tsx` (this task) and `AddToPhoneCard.tsx` (Task 6)
  - `export function ContactForm(props: { cardOwner: string; name: string; email: string; onNameChange: (v: string) => void; onEmailChange: (v: string) => void; consentGiven: boolean; onConsentChange: (v: boolean) => void; onOpenPolicy: () => void }): JSX.Element` — consumed by `App.tsx`

- [ ] **Step 1: Write the webhook config**

Create `mobile/src/lib/config.ts`:

```ts
export const WEBHOOK_URL = "https://n8n.rmhy.net/webhook/biz-card";
```

- [ ] **Step 2: Write the ContactForm component**

Create `mobile/src/components/ContactForm.tsx`:

```tsx
import { useRef, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { WEBHOOK_URL } from "../lib/config";

type Action = "save_card" | "meeting_request";
type Status = "idle" | "sending" | "success" | "error";

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
          meetingDate: action === "meeting_request" ? meetingDate!.toISOString().split("T")[0] : null,
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
```

- [ ] **Step 3: Wire ContactForm into App.tsx**

Update `mobile/App.tsx` — add visitor state and the `<ContactForm>` block between the QR card and the footer link:

```tsx
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProfileCard } from "./src/components/ProfileCard";
import { CardQRCode } from "./src/components/CardQRCode";
import { ContactForm } from "./src/components/ContactForm";
import { PrivacyPolicyModal } from "./src/components/PrivacyPolicyModal";
import { profile } from "./src/data/profile";
import { buildMecard } from "./src/lib/vcard";

export default function App() {
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
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
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Verify in Expo Go**

Run: `npx expo start`, open in Expo Go.
Expected:
- Tapping either submit button with empty fields shows the "Ad soyad ve e-posta alanlarını doldurun." error and red-bordered inputs.
- Filling name+email, tapping "Toplantı Talep Et" without a date shows the date-required error; without checking consent shows the consent-required error.
- Tapping the date field opens a native date picker; past dates are not selectable (`minimumDate` enforced).
- With all fields valid and consent checked, tapping either button shows "Gönderiliyor..." then a success message, and the name/email fields clear.
- Turn off network (airplane mode) and retry to confirm the error path shows "Bir şeyler ters gitti, lütfen tekrar deneyin."

Stop the dev server once confirmed.

- [ ] **Step 6: Commit**

```bash
git add mobile
git commit -m "Add contact form (Kartı Kaydet / Toplantı Talep Et) to Expo app"
```

---

## Task 6: Add to Phone (expo-contacts)

**Files:**
- Create: `mobile/src/components/AddToPhoneCard.tsx`
- Modify: `mobile/App.tsx`
- Modify: `mobile/app.json`

**Interfaces:**
- Consumes: `WEBHOOK_URL` from `lib/config.ts` (Task 5), `Profile` type from `data/profile.ts` (Task 2).
- Produces: `export function AddToPhoneCard(props: { profile: Profile; visitorName: string; visitorEmail: string; hasConsent: boolean }): JSX.Element` — consumed by `App.tsx`.

- [ ] **Step 1: Add contacts permission strings to app.json**

Edit `mobile/app.json`, add under `"expo"`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSContactsUsageDescription": "Kartvizit sahibini rehberine eklemek için."
      }
    },
    "android": {
      "permissions": ["android.permission.WRITE_CONTACTS"]
    },
    "plugins": ["expo-contacts"]
  }
}
```

(Merge into the existing `expo` object from the scaffold — don't remove existing keys like `name`, `slug`, `icon`, etc.)

- [ ] **Step 2: Write the AddToPhoneCard component**

Create `mobile/src/components/AddToPhoneCard.tsx`:

```tsx
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Contacts from "expo-contacts";
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

  const handleAddToPhone = async () => {
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
```

- [ ] **Step 3: Wire AddToPhoneCard into App.tsx**

Update `mobile/App.tsx` — add the import and place `<AddToPhoneCard>` between `<ContactForm>` and the footer link:

```tsx
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
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
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors. (If `Contacts.Contact` field typing complains, adjust the object literal's shape to match the installed `expo-contacts` version's types — keep the same field values.)

- [ ] **Step 5: Verify in Expo Go**

Run: `npx expo start`, open in Expo Go on a physical device (contacts access needs a real device or simulator with a contacts store).
Expected:
- Tapping "Telefonuma Ekle" triggers the OS contacts-permission prompt the first time.
- Denying it shows "Rehbere eklemek için izin gerekiyor." and does not touch the address book.
- Granting it adds "Shenol Mustafa" (LTS CONSULTING, Co-founder, phone, email, website) to the device's contacts — confirm by opening the Contacts app.
- With visitor name/email filled and consent checked, adding also posts to the webhook (success message shown); with consent unchecked or fields empty, the add still succeeds but no webhook call is made.

Stop the dev server once confirmed.

- [ ] **Step 6: Commit**

```bash
git add mobile
git commit -m "Add expo-contacts integration for Telefonuma Ekle"
```

---

## Task 7: Final regression pass

**Files:**
- None (verification-only task; fix forward in the relevant file if something breaks).

**Interfaces:**
- Consumes: the complete app from Tasks 1–6.
- Produces: a confirmed-working `mobile/` app.

- [ ] **Step 1: Full TypeScript check**

Run (from `mobile/`): `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Full manual regression in Expo Go**

Run: `npx expo start`, open in Expo Go. Walk through, in order:
1. Profile card renders correctly (name, title, company, contacts, socials all tappable).
2. QR code scans to a contact-add prompt with correct demo info.
3. Privacy Policy modal opens/closes and scrolls through all 8 sections.
4. Contact form: both empty-submit validation paths, date picker with past-date blocking, successful submit for both `save_card` and `meeting_request` (check the n8n webhook received both, if you have access to check n8n execution history — otherwise confirm via the in-app success message).
5. Add to Phone: permission grant and deny paths, contact appears in the device address book, webhook fires only when visitor info + consent are present.

- [ ] **Step 3: Fix any issues found**

If a step in Step 2 fails, fix it in the relevant component file and re-run Step 1 and the specific failing part of Step 2 until it passes. Commit each fix separately with a message describing what broke and the fix.

- [ ] **Step 4: Final commit**

If Steps 1–2 pass clean with no fixes needed, no commit is required for this task. Otherwise, ensure the last fix commit is in place:

```bash
git status
```

Expected: clean working tree (all fixes already committed in Step 3).
