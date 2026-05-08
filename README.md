# Mini E-Ticaret (whoopsy)

.NET 10 (Onion Architecture, CQRS + MediatR) + Angular 21 + PostgreSQL (Neon) tabanlı staj e-ticaret projesi.

## Tech Stack

- **Backend:** .NET 10, EF Core 10, MediatR, FluentValidation, AutoMapper
- **Frontend:** Angular 21, TypeScript 5
- **Database:** PostgreSQL 17 (Neon Cloud — production / Docker — local opsiyonel)
- **Storage:** Cloudinary (ürün görselleri)
- **Payment:** Iyzico Sandbox
- **CI/CD:** GitHub Actions (backend + frontend + Docker build)

## Lokal Çalıştırma

### Önkoşullar
- .NET 10 SDK ([indir](https://dotnet.microsoft.com/download))
- Node.js 20+ ve npm
- Git

### 1. Repo'yu klonla

```bash
git clone https://github.com/Havali-bir-isim/E-Ticaret.git
cd E-Ticaret
```

### 2. Backend için `.env` dosyası oluştur

Backend uygulaması sırlarını (DB connection, JWT key, Cloudinary, Iyzico) `.env` dosyasından okur. `.env` dosyası `.gitignore`'da olduğu için repo'da yok — kendi makinende oluşturman lazım.

```bash
cd backend/src/Presentation/MiniETicaret.API
cp .env.example .env
```

Sonra `.env` dosyasını editörde aç ve `BURAYA_..._GIRIN` placeholder'larını **takım liderinden aldığın gerçek değerlerle** doldur. Örnek:

```env
ConnectionStrings__DefaultConnection=Host=ep-...neon.tech;Port=5432;Database=neondb;Username=neondb_owner;Password=npg_...;SSLMode=Require;Trust Server Certificate=true
Jwt__SecretKey=<32+ karakterlik random secret>
Cloudinary__CloudName=<cloud-name>
Cloudinary__ApiKey=<api-key>
Cloudinary__ApiSecret=<api-secret>
Iyzico__ApiKey=sandbox-...
Iyzico__SecretKey=sandbox-...
```

> **Not:** .NET hiyerarşik konfig'i için `__` (çift alt çizgi) kullanılıyor. `Cloudinary__ApiKey` runtime'da `Cloudinary:ApiKey` olarak okunur.

### 3. Backend'i çalıştır

```bash
# backend/src/Presentation/MiniETicaret.API içinden
dotnet restore
dotnet run
```

Beklenen çıktı: `Now listening on: http://localhost:5277` + Neon DB query log'ları.
Swagger UI: http://localhost:5277/swagger

### 4. Frontend'i çalıştır

Yeni bir terminal aç:

```bash
cd frontend
npm install
npm start
```

Tarayıcıda: http://localhost:4200

### Test hesabı (DB'de mevcut)

```
Email: claude.debug@whoopsy.com
Şifre: Test1234
```

## Test Çalıştırma

### Backend

```bash
dotnet test backend/tests/MiniETicaret.UnitTests/MiniETicaret.UnitTests.csproj
dotnet test backend/tests/MiniETicaret.IntegrationTests/MiniETicaret.IntegrationTests.csproj
```

### Frontend

```bash
cd frontend
npm test
```

## Klasör Yapısı

```
backend/
├── src/
│   ├── Core/
│   │   ├── MiniETicaret.Application/      # CQRS handlers, validators, DTO'lar
│   │   └── MiniETicaret.Domain/           # Entity'ler, enum'lar, domain interface'ler
│   ├── Infrastructure/
│   │   ├── MiniETicaret.Infrastructure/   # JWT, Cloudinary, Iyzico servisleri
│   │   └── MiniETicaret.Persistence/      # EF Core DbContext, repository'ler, migrations
│   └── Presentation/
│       └── MiniETicaret.API/              # Controllers, middleware, .env, appsettings
└── tests/
    ├── MiniETicaret.UnitTests/            # Handler/validator unit tests (65)
    └── MiniETicaret.IntegrationTests/     # API + WebApplicationFactory testleri (11)

frontend/
└── src/app/                               # Angular standalone components, routes
```

## Sır Yönetimi

Sırlar `dotnet user-secrets` yerine `.env` dosyasında tutuluyor. Detay: bkz. yukarıdaki "Lokal Çalıştırma" bölümü.

- ✅ `.env` dosyası repo'da DEĞİL (`.gitignore`'da)
- ✅ `.env.example` repo'da VAR (placeholder template — yeni geliştiriciye yol gösterici)
- ✅ `appsettings.json` placeholder değerlerle dolu (referans amaçlı)
- ✅ `.env` değerleri runtime'da `appsettings.json`'ı override eder

## Önemli Endpoint'ler

| Method | URL | Açıklama |
|---|---|---|
| `POST` | `/api/auth/register` | Kayıt |
| `POST` | `/api/auth/login` | Giriş (JWT döner) |
| `GET` | `/api/users/me` | Mevcut kullanıcı bilgisi (Auth gerekli) |
| `GET` | `/api/products` | Ürün listesi (paged) |
| `GET` | `/api/categories` | Kategori ağacı |
| `POST` | `/api/orders` | Sipariş oluştur (Auth gerekli) |
| `POST` | `/api/payments/checkout` | Iyzico ödeme başlat (Auth gerekli) |
