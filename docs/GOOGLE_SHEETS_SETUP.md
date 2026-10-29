# Google Sheets başvuru bağlantısı

Bu kılavuz konferans hesabındaki tabloyu ve Apps Script alıcısını kurmak içindir. Yeni bağlantı test edilmeden mevcut çalışan alıcıyı değiştirmeyin.

## 1. Tabloyu ve Apps Script projesini oluştur

1. Konferans hesabıyla özel bir Google Sheets dosyası oluştur: **FBALMUN 2026 Başvuruları**. Paylaşımı **Kısıtlı** tut. Yalnızca başvuruları yönetmesi gereken kişileri ekle.
2. Dosyada **Uzantılar → Apps Script** menüsünü aç.
3. Projedeki `scripts/google-sheets/Code.gs` dosyasının tamamını Apps Script düzenleyicisindeki `Code.gs` içine yapıştır.
4. Proje ayarlarında manifest dosyasını göster; `scripts/google-sheets/appsscript.json` içeriğini `appsscript.json` dosyasına yapıştır. Betik yalnızca Sheets izni ister, Gmail izni istemez.

## 2. Gizli ayarları tanımla

Apps Script **Proje Ayarları → Komut dosyası özellikleri** bölümüne ekle:

- `SPREADSHEET_ID`: Sheets bağlantısında `/d/` ile `/edit` arasındaki dosya kimliği.
- `APPLICATIONS_WEBHOOK_SECRET`: En az 32 karakterli rastgele bir anahtar. Şifre yöneticisiyle oluşturabilir veya terminalde `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` çalıştırabilirsin.

Anahtarı herkese açık bir yere, tablo hücresine veya `VITE_` değişkenine yazma. Aynı değer sunucuda da kullanılacak.

## 3. Sekmeleri oluştur ve web uygulamasını yayınla

1. Apps Script içinde `setupSheets` fonksiyonunu seçip çalıştır. Google'ın izin ekranını hesap sahibi olarak inceleyip onayla.
2. Altı sekme oluşur: **Delegates**, **Delegations**, **Chairboard**, **Admin Staff**, **Press**, **Song Requests**. Başlık satırı dondurulur; kimlik ve teknik tekrar kontrolü sütunları gizlenir. Mevcut bir sekmenin başlıkları beklenenden farklıysa betik üzerine yazmaz.
3. **Dağıt → Yeni dağıtım → Web uygulaması** seç.
4. **Şu kullanıcı olarak çalıştır: Ben** ve **Erişimi olanlar: Herkes** seç. Bu, tabloyu herkese açık yapmaz; alıcı yalnızca gizli anahtarı doğrulanmış sunucu isteklerini kabul eder. GET ile kayıt listelemez.
5. `/exec` ile biten üretim Web uygulaması URL'sini kopyala. `/dev` test URL'sini kullanma.

## 4. Site sunucusunu bağla

Netlify ortam değişkenlerinde ve yerel `.env` dosyasında:

```dotenv
APPLICATIONS_WEBHOOK_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
APPLICATIONS_WEBHOOK_SECRET=Apps_Script_ile_ayni_gizli_deger
```

Netlify'da yeniden deploy et. Yerelde Vite'ı yeniden başlat. Statik dosyaları tek başına başka bir sunucuya koymak yeterli değildir: `/api/applications` sunucu işlevi de çalışmalıdır.

Netlify ortam değişkenleri GitHub'a push ile otomatik değişmez. Yeni URL ve gizli anahtar Netlify proje ayarlarına ayrıca girilmeli; ardından GitHub push veya yeni deploy bu ayarlarla uygulamayı yayınlar. Yeni alıcıyı önce sentetik verilerle doğrulayın; eski tabloyu ve alıcıyı doğrulama tamamlanana kadar koruyun.

## 5. Canlı kontrol

1. Her başvuru türünden, test olduğunu açıkça belirten bir kayıt gönder.
2. Doğru sekmede tarih, Pending durumu ve tüm form alanlarının göründüğünü kontrol et.
3. Başarı ekranının yalnızca Sheets yazımı onaylandığında geldiğini doğrula.
4. Aynı gönderim kimliğiyle tekrar gelen istek yeni satır eklemez. Cevap kaybolduğunda aynı formu tekrar gönderme bu korumayı kullanır; sayfayı kapatmak veya yenilemek tarayıcıdaki bekleyen kimliği sıfırlar.
5. Tabloyu gizli modda açıp erişim istendiğini kontrol et.

6. Güvenlik kontrolünü doğru hedef tabloyla çalıştır:

```sh
node scripts/check-api-security.mjs http://127.0.0.1:5173 YENI_TABLO_KIMLIGI
```

Betik değiştiğinde `node scripts/build-sheets-script.mjs` çalıştırıp yeni `Code.gs` içeriğini yapıştır; Apps Script dağıtımını **yeni sürümle güncelle**. Paylaşılan anahtarı değiştirdiğinde hem sunucuyu hem Apps Script özelliğini güncelle.

## Kapsam

Başvuru formu anonim gönderime açıktır. Bu yapı tablo kayıtlarının okunmasını ve formül çalıştırılmasını engeller; yüksek hacimli spam için CAPTCHA/hız limiti gerekebilir. Apps Script'in hesap bazlı kullanım kotaları vardır; yoğun konferans trafiğinde gönderimleri ve hata oranını izle.


Choose Your Song uses the same server-only relay and stores song name and optional artist in Song Requests. No browser database keys are needed. Existing remote data is not deleted by the project cleanup.
