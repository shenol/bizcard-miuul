import { Avatar } from "./Avatar.jsx";
import { ContactList } from "./ContactList.jsx";

export function ProfileCard({ profile }) {
  return (
    <div className="card">
      <Avatar initials={profile.initials} />

      <div className="name">{profile.name}</div>
      <div className="title">{profile.title}</div>
      <div className="company">{profile.company}</div>

      <div className="divider"></div>

      <ContactList items={profile.contacts} />
      <ContactList items={profile.socials} variant="icons" />
    </div>
  );
}
