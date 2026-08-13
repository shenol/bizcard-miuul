# BizCArd

## Bu proje ne?
BizCard adında dijital bir kartvizit. Vite + React ile derlenen bir web
uygulaması olarak Vercel'de yayında; ileride mobil uygulamaya da dönüşecek.

## Kimin için?
Yazılımcı olmayan iş insanları için hazırlanan bir kurs projesi. Kod basit
ve okunabilir kalsın, gereksiz karmaşıklaşmasın.

## Ton
Sıcak ve profesyonel. Aşırı resmi değil, aşırı gündelik değil.

## Yapı
- `mobile/` klasörü Expo/React Native ile yazılmış mobil uygulama; artık
  aktif geliştirme burada devam ediyor (bkz. `mobile/README.md`). `src/`
  altındaki web uygulaması dondurulmuş durumda - siliniyor değil, ama aktif
  olarak geliştirilmiyor.
- `src/App.jsx` ana bileşen; `src/components/` altında kart, QR kod, iletişim
  formu ve "telefonuma ekle" bileşenleri ayrı dosyalarda.
- `src/data/profile.js` kartvizit sahibinin bilgileri (demo veri).
- `src/lib/config.js` webhook URL'i, `src/lib/vcard.js` vCard oluşturucu.
- QR kod gerçek `qrcode.react` paketiyle render ediliyor; değeri sayfanın o an
  yayında olduğu adrese (`window.location`) göre otomatik belirleniyor.
- Vercel'de yayın: `vercel --prod` ile deploy edilir (proje: `enrion/bizcard-miuul`).

## Şimdilik kapsam
- Tek sayfalık kartvizit: isim, unvan, iletişim bilgileri, QR kod, iletişim
  formu ("Kartı Kaydet" / "Toplantı Talep Et"), "Telefonuma Ekle" (vCard).
- Görsel olarak sade - kalabalık değil.

## Kısıtlar
- Bu aşamada kendi backend/veritabanımız yok; formlar doğrudan bir n8n
  webhook'una gönderim yapıyor.
- Gerçek iletişim bilgileri yerine örnek (demo) veri kullan.