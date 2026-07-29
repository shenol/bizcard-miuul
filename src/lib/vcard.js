export function buildVCard(profile) {
  const phone = profile.contacts.find((c) => c.icon === "phone");
  const email = profile.contacts.find((c) => c.icon === "mail");
  const website = profile.contacts.find((c) => c.icon === "website");
  const [firstName, ...rest] = profile.name.split(" ");
  const lastName = rest.join(" ");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${profile.name}`,
    `ORG:${profile.company}`,
    `TITLE:${profile.title}`,
  ];
  if (phone) lines.push(`TEL;TYPE=CELL:${phone.href.replace("tel:", "")}`);
  if (email) lines.push(`EMAIL:${email.href.replace("mailto:", "")}`);
  if (website) lines.push(`URL:${website.href}`);
  lines.push("END:VCARD");

  return lines.join("\r\n");
}
