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
