import { QRCodeSVG } from "qrcode.react";

export function CardQRCode({ value, size = 140 }) {
  return (
    <div className="qr-code">
      <QRCodeSVG value={value} size={size} fgColor="#14213d" bgColor="#ffffff" level="M" />
    </div>
  );
}
