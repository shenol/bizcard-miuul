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
