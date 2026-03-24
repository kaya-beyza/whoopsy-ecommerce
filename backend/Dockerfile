 # ──────── AŞAMA 1: BUILD ────────
  # SDK image'ı — kodu derlemek için gerekli araçları içerir
  FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
  WORKDIR /app

  # Önce sadece proje dosyalarını kopyala ve restore et
COPY MiniETicaret.slnx ./
  COPY src/Core/MiniETicaret.Domain/*.csproj src/Core/MiniETicaret.Domain/
  COPY src/Core/MiniETicaret.Application/*.csproj src/Core/MiniETicaret.Application/
  COPY src/Infrastructure/MiniETicaret.Infrastructure/*.csproj src/Infrastructure/MiniETicaret.Infrastructure/
  COPY src/Infrastructure/MiniETicaret.Persistence/*.csproj src/Infrastructure/MiniETicaret.Persistence/
  COPY src/Presentation/MiniETicaret.API/*.csproj src/Presentation/MiniETicaret.API/
  COPY tests/MiniETicaret.UnitTests/*.csproj tests/MiniETicaret.UnitTests/

  RUN dotnet restore

  # Şimdi tüm kodu kopyala ve build et
  COPY . .
  RUN dotnet publish src/Presentation/MiniETicaret.API/MiniETicaret.API.csproj \
      --configuration Release \
      --output /app/publish \
      --no-restore

  # ──────── AŞAMA 2: RUNTIME ────────
  # Runtime image'ı — sadece çalıştırmak için gereken minimum şey
  FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime
  WORKDIR /app

  # Build aşamasından sadece yayınlanan dosyaları kopyala
  COPY --from=build /app/publish .

  # Uygulamanın dinleyeceği port
  EXPOSE 5079

  # Container başlatıldığında çalışacak komut
  ENTRYPOINT ["dotnet", "MiniETicaret.API.dll"]