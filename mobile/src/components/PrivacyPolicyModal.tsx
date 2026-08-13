import { Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { profile } from "../data/profile";

export function PrivacyPolicyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const email = profile.contacts.find((c) => c.icon === "mail");

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} accessibilityLabel="Kapat">
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
          <ScrollView>
            <Text style={styles.title}>Kişisel Verilerin Korunması Aydınlatma Metni</Text>
            <Text style={styles.updated}>Son güncelleme: 29 Temmuz 2026</Text>

            <Text style={styles.heading}>1. Veri Sorumlusu</Text>
            <Text style={styles.paragraph}>
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, bu dijital
              kartvizit üzerinden paylaştığınız kişisel verileriniz, veri sorumlusu sıfatıyla{" "}
              {profile.name} ({profile.company}) tarafından aşağıda açıklanan kapsam ve
              amaçlarla işlenmektedir.
            </Text>

            <Text style={styles.heading}>2. İşlenen Kişisel Veriler</Text>
            <Text style={styles.paragraph}>
              Bu sayfadaki formları doldurmanız hâlinde aşağıdaki kişisel verileriniz işlenir:
            </Text>
            <Text style={styles.listItem}>• Ad Soyad</Text>
            <Text style={styles.listItem}>• E-posta adresi</Text>
            <Text style={styles.listItem}>• Toplantı talebinde bulunmanız hâlinde tercih ettiğiniz tarih</Text>
            <Text style={styles.paragraph}>
              Kartviziti telefonunuza eklediğinizde eklenen kişi, yalnızca kartvizit
              sahibinin kendi iletişim bilgilerini içerir; bu işlemin tek başına
              gerçekleştirilmesi hâlinde sizin herhangi bir kişisel veriniz işlenmez.
            </Text>

            <Text style={styles.heading}>3. İşleme Amaçları</Text>
            <Text style={styles.paragraph}>
              Kişisel verileriniz; sizinle iletişime geçilmesi, ilettiğiniz toplantı
              talebinin değerlendirilmesi ve planlanması, ve talep etmeniz hâlinde
              kartvizit sahibinin size ayrıca ulaşabilmesi amaçlarıyla sınırlı olarak
              işlenir.
            </Text>

            <Text style={styles.heading}>4. Hukuki Sebep</Text>
            <Text style={styles.paragraph}>
              Kişisel verileriniz, KVKK'nın 5. maddesi uyarınca açık rızanıza dayanılarak
              işlenmektedir. Formu göndermeden önce onayınız ayrıca alınır.
            </Text>

            <Text style={styles.heading}>5. Kişisel Verilerin Aktarılması</Text>
            <Text style={styles.paragraph}>
              Gönderdiğiniz veriler, formu işleme almak amacıyla kullanılan bir otomasyon/
              entegrasyon hizmeti (webhook) aracılığıyla ilgili üçüncü taraf sunucuya iletilir.
              Bu sunucu yurt içinde veya yurt dışında barındırılabilir. Veriler, açık
              rızanız kapsamında ve yalnızca yukarıda belirtilen amaçlarla aktarılır;
              reklam, pazarlama veya analiz amacıyla başka bir üçüncü tarafla
              paylaşılmaz.
            </Text>

            <Text style={styles.heading}>6. Saklama Süresi</Text>
            <Text style={styles.paragraph}>
              Kişisel verileriniz, talebinizin sonuçlandırılması için gerekli süre
              boyunca ve ilgili mevzuattaki zamanaşımı süreleri saklı kalmak kaydıyla en
              fazla 1 yıl saklanır; bu sürenin sonunda silinir veya anonim hâle
              getirilir.
            </Text>

            <Text style={styles.heading}>7. KVKK Madde 11 Kapsamındaki Haklarınız</Text>
            <Text style={styles.paragraph}>
              İlgili kişi olarak KVKK'nın 11. maddesi uyarınca şu haklara sahipsiniz:
            </Text>
            <Text style={styles.listItem}>• Kişisel verinizin işlenip işlenmediğini öğrenme,</Text>
            <Text style={styles.listItem}>• İşlenmişse buna ilişkin bilgi talep etme,</Text>
            <Text style={styles.listItem}>
              • İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,
            </Text>
            <Text style={styles.listItem}>• Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</Text>
            <Text style={styles.listItem}>• Eksik veya yanlış işlenmişse düzeltilmesini isteme,</Text>
            <Text style={styles.listItem}>
              • KVKK'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,
            </Text>
            <Text style={styles.listItem}>
              • Bu işlemlerin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,
            </Text>
            <Text style={styles.listItem}>
              • İşlenen verilerin analizi sonucu aleyhinize bir sonuç çıkmasına itiraz etme,
            </Text>
            <Text style={styles.listItem}>
              • Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme.
            </Text>

            <Text style={styles.heading}>8. Başvuru</Text>
            <Text style={styles.paragraph}>
              Yukarıdaki haklarınızı kullanmak için{" "}
              {email ? (
                <Text style={styles.link} onPress={() => Linking.openURL(email.href)}>
                  {email.label}
                </Text>
              ) : (
                "iletişim bilgilerimiz üzerinden"
              )}{" "}
              bizimle iletişime geçebilirsiniz.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(20, 33, 61, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 28,
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f4f6f8",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  closeText: {
    color: "#14213d",
    fontSize: 16,
    lineHeight: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#14213d",
    marginBottom: 4,
    paddingRight: 20,
  },
  updated: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 16,
  },
  heading: {
    fontSize: 14,
    fontWeight: "600",
    color: "#14213d",
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 19,
    marginBottom: 4,
  },
  listItem: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 19,
    marginLeft: 8,
  },
  link: {
    color: "#14213d",
    textDecorationLine: "underline",
  },
});
