import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { TokenService } from '../services/token.service'; 

describe('AuthInterceptor', () => {
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;
    let tokenService: TokenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                // Interceptor'ı HTTP client'a bağla
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting(),
                TokenService
            ]
        });

        httpClient = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
        tokenService = TestBed.inject(TokenService);
        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    // ══════════════════════════════════════════
    // TEST 1: Token varsa header'a eklenmeli
    // ══════════════════════════════════════════
    it('should add Authorization header when token exists', () => {
        // Token'ı kaydet (kullanıcı giriş yapmış)
        tokenService.setTokens('my-jwt-token', 'refresh');

        // Herhangi bir HTTP isteği yap
        httpClient.get('/api/test').subscribe();

        // İsteği yakala ve header'ı kontrol et
        const req = httpMock.expectOne('/api/test');
        expect(req.request.headers.has('Authorization')).toBe(true);
        expect(req.request.headers.get('Authorization')).toBe('Bearer my-jwt-token');
        req.flush({});
    });

    // ══════════════════════════════════════════
    // TEST 2: Token yoksa header eklenmemeli
    // ══════════════════════════════════════════
    it('should not add Authorization header when no token', () => {
        // localStorage boş — token yok

        // HTTP isteği yap
        httpClient.get('/api/test').subscribe();

        // İsteği yakala — Authorization header olmamalı
        const req = httpMock.expectOne('/api/test');
        expect(req.request.headers.has('Authorization')).toBe(false);
        req.flush({});
    });
});