# ──────── AŞAMA 1: FRONTEND BUILD (Angular 21) ────────
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npx ng build --configuration=production

# ──────── AŞAMA 2: BACKEND BUILD (.NET 10) ────────
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS backend-build
WORKDIR /app/backend
COPY backend/MiniETicaret.slnx ./
COPY backend/src/Core/MiniETicaret.Domain/*.csproj src/Core/MiniETicaret.Domain/
COPY backend/src/Core/MiniETicaret.Application/*.csproj src/Core/MiniETicaret.Application/
COPY backend/src/Infrastructure/MiniETicaret.Infrastructure/*.csproj src/Infrastructure/MiniETicaret.Infrastructure/
COPY backend/src/Infrastructure/MiniETicaret.Persistence/*.csproj src/Infrastructure/MiniETicaret.Persistence/
COPY backend/src/Presentation/MiniETicaret.API/*.csproj src/Presentation/MiniETicaret.API/
COPY backend/tests/MiniETicaret.UnitTests/*.csproj tests/MiniETicaret.UnitTests/
COPY backend/tests/MiniETicaret.IntegrationTests/*.csproj tests/MiniETicaret.IntegrationTests/
RUN dotnet restore

COPY backend/ ./
RUN dotnet publish src/Presentation/MiniETicaret.API/MiniETicaret.API.csproj \
    --configuration Release \
    --output /app/publish \
    --no-restore

# ──────── AŞAMA 3: FULL-STACK RUNTIME ────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime
WORKDIR /app
COPY --from=backend-build /app/publish .
# Angular build dosyalarını .NET'in wwwroot klasörüne kopyala
COPY --from=frontend-build /app/frontend/dist/frontend/browser ./wwwroot

ENV ASPNETCORE_URLS=http://+:10000
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 10000

ENTRYPOINT ["dotnet", "MiniETicaret.API.dll"]
