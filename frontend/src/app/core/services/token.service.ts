import { Injectable } from '@angular/core';
  @Injectable({ providedIn: 'root' })
  export class TokenService {

    // localStorage'da kullanılacak anahtar isimleri (sabit değerler)
    // Neden sabit? → Birden fazla yerde aynı string'i yazmak yerine tek yerde tanımlıyoruz.
    // Yazım hatası riskini ortadan kaldırır.
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
  }