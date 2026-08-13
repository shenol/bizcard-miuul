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
