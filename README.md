# whOOPSy — Full-Stack E-Ticaret Platformu

Bu proje; lisans mezuniyet bitirme projesi (Graduation Capstone Project) ve staj çalışmamız kapsamında ekip olarak hayata geçirdiğimiz modern bir Full-Stack E-Ticaret platformudur.

Proje kapsamında **.NET 10** tabanlı katmanlı bir backend mimarisi, **Angular 21** ile modern bir web arayüzü ve **Flutter** ile mobil istemci bir araya getirilmiştir.

---

## Benim Rolüm ve Katkılarım (Front-End Developer)

Bu ekip çalışmasında web arayüzünün (**Front-End**) geliştirilmesini baştan sona bizzat üstlendim. Kullanıcının ve yöneticinin etkileşime girdiği tüm ekranlar, görsel deneyim ve API entegrasyonları tarafımdan geliştirilmiştir:

- **Giriş ve Güvenlik Akışları:** Kullanıcı giriş/kayıt (Login & Register) ekranlarının tasarlanması ve geliştirilmesi.
- **Ana Sayfa & Çok Boyutlu Filtreleme:** 4.000'den fazla ürünün listelendiği ana sayfa vitrini, hiyerarşik kategori ağacı, dinamik fiyat aralığı filtreleri ve anlık arama deneyimi.
- **Ürün Detay Sayfası & Galeri:** Bulut (Cloudinary) üzerinden gelen çoklu ürün görsellerinin optimize sunumu, teknik özellik sekmeleri ve detaylı ürün kartları.
- **Sepet ve Favoriler Mimarisi:** Tarayıcı oturumu ve API ile senkronize çalışan, anlık güncellenen sepet ve favori listesi arayüzleri.
- **Kullanıcı Paneli & Sekmeler:** Profil bilgileri, sipariş geçmişi ve adres yönetimi gibi kullanıcı etkileşim sekmelerinin oluşturulması.
- **UI/UX ve Responsive Tasarım:** Angular Material bileşenleri ve özel stil yapılarıyla hem masaüstü hem de mobil cihazlarda akıcı çalışan modern bir kullanıcı arayüzü.
- **Reaktif Durum ve API Entegrasyonu:** Angular 21 (Signals ve RxJS) kullanarak Backend REST API uç noktalarının güvenli ve performanslı tüketimi.

---

## Genel Mimari ve Teknoloji Yığını

Ekip olarak projenin sürdürülebilirliğini sağlamak adına katmanlı mimari prensiplerini benimsedik:

| Katman | Teknoloji | Açıklama |
|---|---|---|
| **Frontend (Benim Rolüm)** | **Angular 21** | Signals, Standalone Components, Angular Material, RxJS |
| **Backend** | **.NET 10 (C#)** | Onion Architecture, CQRS (MediatR), FluentValidation |
| **Veritabanı & ORM** | **PostgreSQL 17 & EF Core 10** | Code-First yaklaşımı, ilişkisel veri yönetimi |
| **Ödeme & Bulut** | **Iyzico Sandbox & Cloudinary** | Sanal POS ödeme entegrasyonu ve CDN tabanlı görsel barındırma |
| **Mobil İstemci** | **Flutter** | Cross-platform mobil uygulama |
| **Test Altyapısı** | **xUnit & Integration Tests** | 75'ten fazla birim ve API entegrasyon testi |

```text
MiniETicaret/
├── frontend/                             # [Geliştirdiğim Alan] Angular 21 Web İstemcisi
├── backend/                              # .NET 10 Onion Architecture & REST API
│   ├── Core/                             # Domain ve Application (CQRS / MediatR)
│   ├── Infrastructure/                   # Iyzico, Cloudinary, JWT servisleri
│   └── Presentation/                     # MiniETicaret.API
└── mobile/                               # Flutter Mobil İstemcisi
```

---

## Öne Çıkan Fonksiyonlar & İş Akışı

- **Uçtan Uca Müşteri Deneyimi:** Ürün arama ve filtreleme $\rightarrow$ Detaylı ürün ve galeri inceleme $\rightarrow$ Sepete ekleme $\rightarrow$ Iyzico Sandbox ile güvenli ödeme simülasyonu.
- **Dinamik Kategori & Ürün Ağacı:** 4.000'den fazla ürün üzerinde gecikmesiz çalışan hiyerarşik kategori navigasyonu ve anlık fiyat/özellik filtreleme.
- **Görsel Optimizasyonu:** Cloudinary CDN altyapısıyla sayfaları yormayan, hızlı yüklenen ve bant genişliğini koruyan medya yönetimi.

---

## Projeyi Bilgisayarınızda Çalıştırma

Projeyi yerel geliştirme ortamınızda ayağa kaldırmak için:

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/kaya-beyza/whoopsy-ecommerce.git
cd whoopsy-ecommerce
```

### 2. Backend'i Başlatın (.NET 10)
```bash
cd backend/src/Presentation/MiniETicaret.API
dotnet restore
dotnet run
```
> API Varsayılan Adresi: **http://localhost:5277** | Swagger: **http://localhost:5277/swagger**

### 3. Frontend'i Başlatın (Angular 21)
Yeni bir terminal sekmesinde:
```bash
cd frontend
npm install
npm start
```
> Web Uygulaması: **http://localhost:4200**

---

## Ekip ve Katkıda Bulunanlar

Bu proje bir bitirme ve staj ekip çalışması olarak geliştirilmiştir:

- **Beyza Kaya** — *Front-End Developer (Angular Arayüzleri, UI/UX & API Entegrasyonu)* — [GitHub Profilim](https://github.com/kaya-beyza)
- Ahmet Bıçakçı
- Ahmet Eren Zembilören
- Beyza Karaköse
- Nurgül Tunç
- Samet Arar

---

## İletişim

Geliştirme sürecine dair sorularınız, önerileriniz veya iş fırsatları için bana dilediğiniz zaman ulaşabilirsiniz:

- **E-Posta:** beyzzakayya@gmail.com
- **GitHub:** [@kaya-beyza](https://github.com/kaya-beyza)
- **LinkedIn:** [Beyza Kaya](https://linkedin.com/in/kaya-beyza)
