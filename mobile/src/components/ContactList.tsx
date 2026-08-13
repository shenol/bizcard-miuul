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
