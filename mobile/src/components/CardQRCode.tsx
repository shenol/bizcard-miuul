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
