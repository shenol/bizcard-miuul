import { profile } from "../data/profile.js";

export function PrivacyPolicyModal({ open, onClose }) {
  if (!open) return null;

  const email = profile.contacts.find((c) => c.icon === "mail");

  return (
    <div className="policy-overlay" onClick={onClose}>
      <div className="policy-modal" onClick={(event) => event.stopPropagation()}>
        <button className="policy-close" type="button" onClick={onClose} aria-label="Kapat">
          ×
        </button>

        <h2 className="policy-title">Kişisel Verilerin Korunması Aydınlatma Metni</h2>
        <p className="policy-updated">Son güncelleme: 29 Temmuz 2026</p>

        <h3>1. Veri Sorumlusu</h3>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, bu dijital
          kartvizit üzerinden paylaştığınız kişisel verileriniz, veri sorumlusu sıfatıyla{" "}
          <strong>{profile.name}</strong> ({profile.company}) tarafından aşağıda açıklanan
          kapsam ve amaçlarla işlenmektedir.
        </p>

        <h3>2. İşlenen Kişisel Veriler</h3>
        <p>Bu sayfadaki formları doldurmanız hâlinde aşağıdaki kişisel verileriniz işlenir:</p>
        <ul>
          <li>Ad Soyad</li>
          <li>E-posta adresi</li>
          <li>Toplantı talebinde bulunmanız hâlinde tercih ettiğiniz tarih</li>
        </ul>
        <p>
          Kartviziti telefonunuza eklediğinizde indirilen dosya, yalnızca kartvizit
          sahibinin kendi iletişim bilgilerini içerir; bu indirme işleminin tek başına
          gerçekleştirilmesi hâlinde sizin herhangi bir kişisel veriniz işlenmez.
        </p>

        <h3>3. İşleme Amaçları</h3>
        <p>
          Kişisel verileriniz; sizinle iletişime geçilmesi, ilettiğiniz toplantı
          talebinin değerlendirilmesi ve planlanması, ve talep etmeniz hâlinde
          kartvizit sahibinin size ayrıca ulaşabilmesi amaçlarıyla sınırlı olarak
          işlenir.
        </p>

        <h3>4. Hukuki Sebep</h3>
        <p>
          Kişisel verileriniz, KVKK'nın 5. maddesi uyarınca açık rızanıza dayanılarak
          işlenmektedir. Formu göndermeden önce onayınız ayrıca alınır.
        </p>

        <h3>5. Kişisel Verilerin Aktarılması</h3>
        <p>
          Gönderdiğiniz veriler, formu işleme almak amacıyla kullanılan bir otomasyon/
          entegrasyon hizmeti (webhook) aracılığıyla ilgili üçüncü taraf sunucuya iletilir.
          Bu sunucu yurt içinde veya yurt dışında barındırılabilir. Veriler, açık
          rızanız kapsamında ve yalnızca yukarıda belirtilen amaçlarla aktarılır;
          reklam, pazarlama veya analiz amacıyla başka bir üçüncü tarafla
          paylaşılmaz.
        </p>

        <h3>6. Saklama Süresi</h3>
        <p>
          Kişisel verileriniz, talebinizin sonuçlandırılması için gerekli süre
          boyunca ve ilgili mevzuattaki zamanaşımı süreleri saklı kalmak kaydıyla en
          fazla 1 yıl saklanır; bu sürenin sonunda silinir veya anonim hâle
          getirilir.
        </p>

        <h3>7. KVKK Madde 11 Kapsamındaki Haklarınız</h3>
        <p>İlgili kişi olarak KVKK'nın 11. maddesi uyarınca şu haklara sahipsiniz:</p>
        <ul>
          <li>Kişisel verinizin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
          <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
          <li>KVKK'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
          <li>Bu işlemlerin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
          <li>İşlenen verilerin analizi sonucu aleyhinize bir sonuç çıkmasına itiraz etme,</li>
          <li>Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
        </ul>

        <h3>8. Başvuru</h3>
        <p>
          Yukarıdaki haklarınızı kullanmak için{" "}
          {email ? <a href={email.href}>{email.label}</a> : "iletişim bilgilerimiz üzerinden"} bizimle
          iletişime geçebilirsiniz.
        </p>
      </div>
    </div>
  );
}
