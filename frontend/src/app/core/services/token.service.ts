import { Injectable } from '@angular/core';
  @Injectable({ providedIn: 'root' })
  export class TokenService {

    private readonly ACCESS_TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';

    // ───── TOKEN KAYDETME ─────
    // Login başarılı olduğunda backend'den gelen token'ları tarayıcıya kaydeder.
    setTokens(accessToken: string, refreshToken: string): void {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }

    // ───── TOKEN OKUMA ─────
    // API'ye istek atarken Header'a eklemek için access token'ı okur.
    getAccessToken(): string | null {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    // Refresh token'ı okur (access token süresi dolduğunda yeni token almak için kullanılır).
    getRefreshToken(): string | null {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    // ───── TOKEN SİLME (LOGOUT) ─────
    // Kullanıcı çıkış yaptığında her iki token'ı da siler.
    clearTokens(): void {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    // ───── GİRİŞ KONTROLÜ ─────
    // Access token var mı yok mu kontrol eder.
    // true → kullanıcı giriş yapmış, false → giriş yapmamış.
    // AuthGuard bu metodu kullanarak "bu sayfaya girebilir mi?" kararını verecek.
    isLoggedIn(): boolean {
      return !!this.getAccessToken();
    }
    // ───── TOKEN'DAN KULLANICI ID OKUMA ─────
  getUserIdFromToken(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      // Token'ın orta kısmını (payload) alıyoruz
      const payload = token.split('.')[1];
      // Şifreyi çözüp JSON objesine çeviriyoruz
      const decodedPayload = JSON.parse(atob(payload));
      
      // Backend .NET (C#) ise genelde ID şu uzun key içinde gelir:
      const nameIdentifier = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
      
      // ID'yi dondur (Backend'in ID'yi 'id', 'sub' veya nameidentifier olarak göndermesine göre yakalar)
      return decodedPayload[nameIdentifier] || decodedPayload['id'] || decodedPayload['sub'] || null;
      
    } catch (e) {
      console.error('Token çözülürken hata oluştu', e);
      return null;
    }
  }
  }