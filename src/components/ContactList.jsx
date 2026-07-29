import { ICONS } from "./icons.jsx";

export function ContactList({ items, variant = "rows" }) {
  if (variant === "icons") {
    return (
      <div className="socials">
        {items.map((item) => (
          <a key={item.label} href={item.href} target="_blank" rel="noopener" aria-label={item.label}>
            {ICONS[item.icon]}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="contact">
      {items.map((item) => (
        <a key={item.label} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener" : undefined}>
          {ICONS[item.icon]}
          <span>{item.label}</span>
        </a>
      ))}
    </div>
  );
}
