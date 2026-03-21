import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable, tap } from 'rxjs';
  import { LoginRequest, RegisterRequest, TokenResponse } from '../models/auth.model';
  import { TokenService } from './token.service';

  // Bu servis backend'deki AuthController ile konuşur.
  // Login, Register ve RefreshToken isteklerini HTTP ile gönderir.
  @Injectable({ providedIn: 'root' })
  export class AuthService {

    // Backend API'nin adresi.
    // Şimdilik hardcode — ileride environment dosyasından alacağız.
    private apiUrl = 'https://localhost:5001/api/Auth';

    // ───── DEPENDENCY INJECTION ─────
    // HttpClient → HTTP istekleri atmak için (GET, POST, PUT, DELETE)
    // TokenService → Gelen token'ları localStorage'a kaydetmek için
    // Backend'deki constructor injection ile birebir aynı mantık.
    constructor(
      private http: HttpClient,
      private tokenService: TokenService
    ) {}

    // ───── LOGIN ─────
    // Backend'deki POST /api/Auth/login endpoint'ine istek atar.
    // Başarılıysa gelen token'ları otomatik olarak localStorage'a kaydeder.
    login(request: LoginRequest): Observable<TokenResponse> {
      return this.http.post<TokenResponse>(`${this.apiUrl}/login`, request)
        .pipe(
          tap(response => {
            // tap → "Akan veriyi yakala ama değiştirme" demek.
            // Yani response geldiğinde token'ları kaydet,
            // ama response'u olduğu gibi sonraki adıma aktar.
            this.tokenService.setTokens(response.accessToken, response.refreshToken);
          })
        );
    }

    // ───── REGISTER ─────
    // Backend'deki POST /api/Auth/register endpoint'ine istek atar.
    // Register sonrası da token dönüyor (otomatik login).
    register(request: RegisterRequest): Observable<TokenResponse> {
      return this.http.post<TokenResponse>(`${this.apiUrl}/register`, request)
        .pipe(
          tap(response => {
            this.tokenService.setTokens(response.accessToken, response.refreshToken);
          })
        );
    }

    // ───── REFRESH TOKEN ─────
    // Access token süresi dolduğunda, refresh token ile yeni token çifti alır.
    // Backend'deki POST /api/Auth/refresh-token endpoint'ine istek atar.
    refreshToken(): Observable<TokenResponse> {
      const refreshToken = this.tokenService.getRefreshToken();
      return this.http.post<TokenResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
        .pipe(
          tap(response => {
            this.tokenService.setTokens(response.accessToken, response.refreshToken);
          })
        );
    }

    // ───── LOGOUT ─────
    // Token'ları siler. Backend'e istek atmaya gerek yok çünkü
    // JWT stateless — sunucu tarafında session tutmuyoruz.
    logout(): void {
      this.tokenService.clearTokens();
    }
  }