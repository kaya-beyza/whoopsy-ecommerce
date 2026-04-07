# ──────── AŞAMA 1: BUILD ────────
# "İçinde Nginx önceden kurulu olan bir Linux bilgisayar başlat."
  FROM node:22-alpine AS build 
  WORKDIR /app

  # Amaç: package.json değişmediyse npm ci cache'ten çalışsın
  COPY package.json package-lock.json ./
  RUN npm ci

  # Tüm kodu kopyala ve Angular'ı production modda build et
  COPY . .
  RUN npx ng build --configuration=production

  # ──────── AŞAMA 2: SERVE ────────
  # Nginx — hafif bir web sunucu. Build edilen statik dosyaları servis eder
  # Neden Nginx? Angular build çıktısı sadece HTML/CSS/JS dosyaları.
  # Bunları sunmak için bir web sunucu lazım. Nginx en popüler ve en hafif olanı.
  FROM nginx:alpine AS runtime

  # Angular'ın build çıktısı dist/ klasöründe oluşur
  # Bunu Nginx'in servis ettiği klasöre kopyalıyoruz
  COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

  # Nginx 80 portunda çalışır
  EXPOSE 80