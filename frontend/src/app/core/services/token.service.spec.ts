import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
    let service: TokenService;

    // Her testten önce çalışır — temiz bir servis instance'ı oluşturur
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TokenService);

        // Her test öncesi localStorage'ı temizle
        // Böylece testler birbirini etkilemez
        localStorage.clear();
    });

    // Testlerden sonra da temizle (son test için)
    afterEach(() => {
        localStorage.clear();
    });

    // ══════════════════════════════════════════
    // TEST 1: Servis oluşturulabiliyor mu?
    // ══════════════════════════════════════════
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // ══════════════════════════════════════════
    // TEST 2: Token'ları kaydedebilmeli
    // ══════════════════════════════════════════
    it('should save tokens to localStorage', () => {
        service.setTokens('test-access-token', 'test-refresh-token');

        expect(localStorage.getItem('access_token')).toBe('test-access-token');
        expect(localStorage.getItem('refresh_token')).toBe('test-refresh-token');
    });

    // ══════════════════════════════════════════
    // TEST 3: Access token okuyabilmeli
    // ══════════════════════════════════════════
    it('should return access token', () => {
        localStorage.setItem('access_token', 'my-token');

        expect(service.getAccessToken()).toBe('my-token');
    });

    // ══════════════════════════════════════════
    // TEST 4: Refresh token okuyabilmeli
    // ══════════════════════════════════════════
    it('should return refresh token', () => {
        localStorage.setItem('refresh_token', 'my-refresh');

        expect(service.getRefreshToken()).toBe('my-refresh');
    });

    // ══════════════════════════════════════════
    // TEST 5: Token'ları temizleyebilmeli
    // ══════════════════════════════════════════
    it('should clear all tokens', () => {
        // Önce kaydet
        service.setTokens('access', 'refresh');

        // Sonra temizle
        service.clearTokens();

        expect(service.getAccessToken()).toBeNull();
        expect(service.getRefreshToken()).toBeNull();
    });

    // ══════════════════════════════════════════
    // TEST 6: isLoggedIn doğru çalışmalı
    // ══════════════════════════════════════════
    it('should return true when access token exists', () => {
        service.setTokens('token', 'refresh');
        expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false when no access token', () => {
        expect(service.isLoggedIn()).toBe(false);
    });
});