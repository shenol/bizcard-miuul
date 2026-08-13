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
