# BizCard Mobile (Expo)

BizCard dijital kartvizitinin Expo/React Native ile yazılmış mobil sürümü.

## Çalıştırma

```
cd mobile
npx expo start
```

Açılan QR kodu Expo Go uygulamasıyla telefonunuzdan taratın, ya da terminalde
`i` (iOS simülatörü) veya `a` (Android emülatörü) tuşuna basın.

Bu uygulama standart Expo Go istemcisiyle çalışacak şekilde yazıldı; özel bir
dev client veya EAS build gerektirmiyor.

## Notlar

- `src/components/AddToPhoneCard.tsx` içindeki `expo-contacts` içe aktarımı
  bilinçli olarak `expo-contacts/legacy` yolunu kullanıyor: yüklü SDK
  sürümünde paketin varsayılan export'u, bu bileşenin kullandığı fonksiyon
  tabanlı API yerine class tabanlı farklı bir API'ye taşındı. Bu bir hata
  değil, kasıtlı bir tercih - lütfen "düzeltmeyin".
