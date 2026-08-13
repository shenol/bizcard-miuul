# BizCard: Expo/React Native Migration — Design Spec

Date: 2026-08-13

## Context

BizCard is currently a single-page Vite + React web app deployed to Vercel
(project `enrion/bizcard-miuul`), showing a digital business card: profile
info, a QR code, a contact/meeting-request form (posts to an n8n webhook),
an "Add to Phone" (vCard download) action, and a KVKK privacy policy modal.

The goal of this migration is to rebuild the same functionality as an Expo
(React Native) app that runs in Expo Go — no custom native code, no dev
client required. The web app stops being the product; going forward this
is a native app.

## Decisions (confirmed with user)

1. **Full replacement, not dual-stack.** The Expo app is the new product.
   The existing Vite web app is not actively maintained going forward.
2. **New project lives in `mobile/`** (its own `package.json`, not the repo
   root) rather than replacing the root Vite files in place.
3. **Language: TypeScript** (Expo's default template), despite
   CLAUDE.md's general "keep it simple" guidance for non-technical
   audiences — user explicitly chose TS over JS.
4. **QR code now encodes a MECARD string** (the card owner's own contact
   info), not a URL — there is no live web page to point to anymore.
5. **"Telefonuma Ekle" uses `expo-contacts`** to add the card owner
   directly to the visitor's address book (requesting `CONTACTS`
   permission at tap time), not a vCard file share. This was an explicit
   choice — the user considered and rejected the no-permission
   share-sheet alternative.
6. Everything else (webhook contract, form validation rules, KVKK modal
   content, visual styling/colors) carries over unchanged in behavior.

## Scope

In scope:
- New Expo (TypeScript) project under `mobile/`.
- Port of all 7 components + data/lib modules to React Native.
- `expo-contacts` integration for "Telefonuma Ekle".
- QR code showing MECARD data via `react-native-qrcode-svg`.
- Meeting-date picker via `@react-native-community/datetimepicker`.
- KVKK privacy modal ported to RN `Modal`.
- `app.json` permission strings (iOS `NSContactsUsageDescription`,
  Android contacts permission).

Out of scope (explicitly not doing):
- Changing or deprecating the existing Vite/web project's files — they
  are left as-is in the repo, just no longer the active target.
- Any backend/API changes — the n8n webhook and its JSON payload shape
  are reused unchanged.
- Automated tests (none exist in the current project; not introducing a
  test framework as part of this migration).
- EAS Build / production app store builds — Expo Go only, per user
  request ("Expo Go'da çalışır kalsın").
- Navigation library — the app is a single scrollable screen, same as
  today's single-page card.

## Project Structure

```
BizCard/
├─ src/, index.html, vite.config.js, package.json   (existing web app — untouched)
└─ mobile/
   ├─ App.tsx
   ├─ app.json
   ├─ package.json
   ├─ tsconfig.json
   └─ src/
      ├─ components/
      │  ├─ ProfileCard.tsx
      │  ├─ Avatar.tsx
      │  ├─ ContactList.tsx
      │  ├─ CardQRCode.tsx
      │  ├─ ContactForm.tsx
      │  ├─ AddToPhoneCard.tsx
      │  └─ PrivacyPolicyModal.tsx
      ├─ data/
      │  └─ profile.ts
      └─ lib/
         ├─ config.ts
         └─ vcard.ts
```

One function component per file, matching the existing web project's
convention (see `bizcard-conventions` skill's component rule — note its
webhook payload section describes an older/stale contract and is NOT the
source of truth; `mobile/src/components/ContactForm.tsx` and
`AddToPhoneCard.tsx` follow the *current* web app's actual payload shape,
documented below).

## Data & Types

`src/data/profile.ts` — same shape as today's `src/data/profile.js`, with
light TS types:

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

export const profile: Profile = { /* same demo values as current profile.js */ };
```

`src/lib/config.ts` — unchanged constant:
```ts
export const WEBHOOK_URL = "https://n8n.rmhy.net/webhook/biz-card";
```

## Component Mapping

| Web (current)         | Expo (new)                          | Notes |
|------------------------|--------------------------------------|-------|
| `Avatar.jsx`            | `Avatar.tsx`                         | `View` circle + `Text` initials |
| `ContactList.jsx`       | `ContactList.tsx`                    | rows use `TouchableOpacity` + `Linking.openURL(href)`; icons variant same, circular buttons |
| `icons.jsx` (inline SVG)| removed — `Ionicons` from `@expo/vector-icons` | `call`, `mail`, `globe-outline`, `logo-linkedin`, `logo-instagram` |
| `ProfileCard.jsx`       | `ProfileCard.tsx`                    | `View`/`Text` layout, same visual hierarchy |
| `CardQRCode.jsx`        | `CardQRCode.tsx`                     | `react-native-qrcode-svg`, value = `buildMecard(profile)` |
| `ContactForm.jsx`       | `ContactForm.tsx`                    | `TextInput` fields, `DateTimePicker` for meeting date, custom checkbox row for consent, two submit `TouchableOpacity` buttons |
| `AddToPhoneCard.jsx`    | `AddToPhoneCard.tsx`                 | `expo-contacts` add flow (see below) instead of Blob/vCard download |
| `PrivacyPolicyModal.jsx`| `PrivacyPolicyModal.tsx`             | RN `Modal` + `ScrollView`, same KVKK text content |
| `App.jsx`               | `App.tsx`                            | same top-level state (`visitorName`, `visitorEmail`, `consentGiven`, `isPolicyOpen`); drops `liveUrl`/`window.location` |
| `lib/vcard.js`          | `lib/vcard.ts`                       | new `buildMecard(profile): string` for the QR code (see below); no more Blob-based `.vcf` builder needed since `expo-contacts` takes a structured object, not a vCard string |

Styling: `StyleSheet.create` objects per component, reusing the existing
color palette (`#14213d` primary, `#6b7280` muted text, `#f4f6f8`
background, `#e5e7eb` borders, `#b91c1c` error, `#15803d` success) and
spacing/radii from `src/index.css`.

## QR Code (MECARD)

`buildMecard(profile)` in `lib/vcard.ts` replaces web's `buildVCard`:

```
MECARD:N:<lastName>,<firstName>;ORG:<company>;TEL:<phone>;EMAIL:<email>;URL:<website>;;
```

Rendered via `react-native-qrcode-svg`'s `<QRCode value={...} size={140} color="#14213d" backgroundColor="#ffffff" />` — same visual role as today's `qrcode.react` usage, just a different payload.

## "Telefonuma Ekle" (expo-contacts)

Replaces the current Blob/`<a download>` vCard flow. On tap:

1. `const { status } = await Contacts.requestPermissionsAsync()`.
2. If `status !== 'granted'`: show an inline message ("Rehbere eklemek için izin gerekiyor.") and stop — no webhook call.
3. If granted: build a `Contacts.Contact` object from `profile` (name, company, job title, phone numbers, emails, urls) and call `Contacts.addContactAsync(contact)`.
4. On success, same downstream behavior as today: if `hasConsent && visitorName.trim() && visitorEmail.trim()`, POST to `WEBHOOK_URL` with the **same JSON shape as the current `AddToPhoneCard.jsx`**:
   ```json
   {
     "type": "phone_contact_saved",
     "name": "<visitorName>",
     "email": "<visitorEmail>",
     "cardOwner": "<profile.name>",
     "submittedAt": "<ISO timestamp>"
   }
   ```
5. Status states mirror today's: `idle | sending | success | error`, plus a new `permission-denied` case shown as a form message.

`app.json` additions:
```json
{
  "expo": {
    "ios": { "infoPlist": { "NSContactsUsageDescription": "Kartvizit sahibini rehberine eklemek için." } },
    "android": { "permissions": ["android.permission.WRITE_CONTACTS"] },
    "plugins": ["expo-contacts"]
  }
}
```

## Meeting Form

Same validation rules as `ContactForm.jsx` today (name + email required,
meeting date required and not in the past when action is
`meeting_request`, consent checkbox required, single-submission guard via
a ref). Only the date input changes: `@react-native-community/datetimepicker`
opens a native date picker on tap of a styled field, `minimumDate={new
Date()}` enforces no past dates. Webhook payload shape for both
`save_card` and `meeting_request` actions is reused verbatim from
`ContactForm.jsx` (`type`, `name`, `email`, `meetingDate`, `cardOwner`,
`submittedAt`).

## Privacy Policy Modal

Same KVKK sections and copy as `PrivacyPolicyModal.jsx`, rendered as
`Text`/`View` inside a RN `Modal` (`transparent`, `animationType="fade"`)
with a `ScrollView` for the body and a close button in the top-right
corner.

## Dependencies (new, `mobile/package.json`)

- `expo`, `expo-contacts`
- `react-native-qrcode-svg` (+ its `react-native-svg` peer — Expo Go compatible)
- `@react-native-community/datetimepicker`
- `@expo/vector-icons` (ships with Expo, no extra install needed)

All of the above are supported inside the standard Expo Go client — no
`expo-dev-client` / custom native build required, satisfying the "Expo
Go'da çalışır kalsın" constraint.

## Dev Workflow

`cd mobile && npx expo start` → scan the terminal QR with the Expo Go app
on a physical device (or press `i`/`a` for simulator/emulator) to run.
No build step needed for iteration; matches today's `npm run dev` /
Vite HMR loop in spirit.

## Error Handling

- Webhook `fetch` failures: same try/catch → `status: "error"` → existing
  red `form-message`-style text, unchanged behavior.
- Contacts permission denial: handled distinctly (see above), not
  conflated with webhook errors.
- No network/offline handling beyond what exists today (none) — out of
  scope, matches current web behavior.

## Testing

No automated tests, consistent with the current project. Verification is
manual: run in Expo Go, exercise both form actions, the contacts-add
flow (grant and deny paths), QR scan with a phone camera app, and the
privacy modal open/close.
