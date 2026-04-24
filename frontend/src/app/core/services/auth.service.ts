import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, TokenResponse } from '../models/auth.model';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';

// Bu servis backend'deki AuthController ile konuşur.
// Login, Register ve RefreshToken isteklerini HTTP ile gönderir.
@Injectable({ providedIn: 'root' })
export class AuthService {

  // Backend API'nin adresi.
  private apiUrl = `${environment.apiUrl}/Auth`;
  
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  // Global authentication state
  isLoggedIn = signal<boolean>(this.tokenService.isLoggedIn());
  currentUser = signal<any>(this.getUserFromToken());

  private getUserFromToken(): any {
    const token = this.tokenService.getAccessToken();
    if (!token) return null;
    try {
      // Normalize JWT payload from Base64Url to Base64
      let payloadBase64 = token.split('.')[1];
      
      // Base64Url -> Base64 dönüşümü: Tireleri artıya, alt tireleri bölüye çevir
      payloadBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      
      // Eksik dolguları (padding) tamamlıyoruz
      while (payloadBase64.length % 4) {
        payloadBase64 += '=';
      }

      // Properly decode UTF-8 data to support non-ASCII characters
      const decodedData = atob(payloadBase64);
      const payloadJson = decodeURIComponent(decodedData.split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(payloadJson);

      // Map standard JWT claim URIs to application User model
      return {
        id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        fullName: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      };
    } catch (e) {
      console.error('Token decoding error:', e);
      return null;
    }
  }

  constructor() { }

  // ───── LOGIN ─────
  // Backend'deki POST /api/Auth/login endpoint'ine istek atar.
  // Başarılıysa gelen token'ları otomatik olarak localStorage'a kaydeder.
  login(request: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          this.tokenService.setTokens(response.accessToken, response.refreshToken);
          this.isLoggedIn.set(true); 
          this.currentUser.set(this.getUserFromToken()); // Extract user metadata
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
          this.isLoggedIn.set(true); 
          this.currentUser.set(this.getUserFromToken()); // Set user context
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

  // ───── SESSION MANAGEMENT ─────
  // Updates local storage and triggers reactive signals for immediate UI refresh.
  setSession(accessToken: string, refreshToken: string): void {
    this.tokenService.setTokens(accessToken, refreshToken);
    this.isLoggedIn.set(true);
    this.currentUser.set(this.getUserFromToken());
  }

  // ───── LOGOUT ─────
  // Token'ları siler. Backend'e istek atmaya gerek yok çünkü
  // JWT stateless — sunucu tarafında session tutmuyoruz.
  logout(): void {
    this.tokenService.clearTokens();
    this.isLoggedIn.set(false);
    this.currentUser.set(null); // Clear user state
  }
}