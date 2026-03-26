import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { vi } from 'vitest';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let tokenService: TokenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                TokenService
            ]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        tokenService = TestBed.inject(TokenService);

        // TokenService metodlarını spy'la (izle)
        // Backend'deki Mock.Setup gibi — gerçek metodu çağırmaz, sadece izler
        vi.spyOn(tokenService, 'setTokens');
        vi.spyOn(tokenService, 'clearTokens');
        vi.spyOn(tokenService, 'getRefreshToken').mockReturnValue('old-refresh');
    });

    afterEach(() => {
        httpMock.verify();
        vi.restoreAllMocks();
        localStorage.clear();
    });

    // ══════════════════════════════════════════
    // TEST 1: Login başarılıysa token kaydedilmeli
    // ══════════════════════════════════════════
    it('should call API and save tokens on login', () => {
        const mockResponse = {
            accessToken: 'fake-access',
            refreshToken: 'fake-refresh'
        };

        service.login({ email: 'test@mail.com', password: '123456' })
            .subscribe(response => {
                expect(response.accessToken).toBe('fake-access');
                expect(response.refreshToken).toBe('fake-refresh');
            });

        const req = httpMock.expectOne('https://localhost:5001/api/Auth/login');
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        expect(tokenService.setTokens).toHaveBeenCalledWith('fake-access', 'fake-refresh');
    });

    // ══════════════════════════════════════════
    // TEST 2: Register başarılıysa token kaydedilmeli
    // ══════════════════════════════════════════
    it('should call API and save tokens on register', () => {
        const mockResponse = {
            accessToken: 'reg-access',
            refreshToken: 'reg-refresh'
        };

        service.register({ fullName: 'Test User', email: 'test@mail.com', password: '123456' })
            .subscribe(response => {
                expect(response.accessToken).toBe('reg-access');
            });

        const req = httpMock.expectOne('https://localhost:5001/api/Auth/register');
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        expect(tokenService.setTokens).toHaveBeenCalledWith('reg-access', 'reg-refresh');
    });

    // ══════════════════════════════════════════
    // TEST 3: RefreshToken yeni token çifti almalı
    // ══════════════════════════════════════════
    it('should send refresh token and save new tokens', () => {
        const mockResponse = {
            accessToken: 'new-access',
            refreshToken: 'new-refresh'
        };

        service.refreshToken().subscribe();

        const req = httpMock.expectOne('https://localhost:5001/api/Auth/refresh-token');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ refreshToken: 'old-refresh' });
        req.flush(mockResponse);

        expect(tokenService.setTokens).toHaveBeenCalledWith('new-access', 'new-refresh');
    });

    // ══════════════════════════════════════════
    // TEST 4: Logout token'ları silmeli
    // ══════════════════════════════════════════
    it('should clear tokens on logout', () => {
        service.logout();

        expect(tokenService.clearTokens).toHaveBeenCalled();
    });
});