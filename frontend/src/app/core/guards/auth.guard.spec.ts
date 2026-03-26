import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { TokenService } from '../services/token.service';
import { vi } from 'vitest';

describe('AuthGuard', () => {
    let tokenService: TokenService;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TokenService,
                // Sahte Router oluştur — sadece navigate metodunu izliyoruz
                { provide: Router, useValue: { navigate: vi.fn() } }
            ]
        });

        tokenService = TestBed.inject(TokenService);
        router = TestBed.inject(Router);
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    // ══════════════════════════════════════════
    // TEST 1: Token varsa erişime izin ver
    // ══════════════════════════════════════════
    it('should allow access when user is logged in', () => {
        // Token'ı localStorage'a koy (kullanıcı giriş yapmış)
        tokenService.setTokens('valid-token', 'refresh');

        // Guard'ı çalıştır
        const result = TestBed.runInInjectionContext(() =>
            authGuard({} as any, {} as any)
        );

        // Erişime izin vermeli
        expect(result).toBe(true);
    });

    // ══════════════════════════════════════════
    // TEST 2: Token yoksa login'e yönlendir
    // ══════════════════════════════════════════
    it('should redirect to login when user is not logged in', () => {
        // localStorage boş — token yok

        // Guard'ı çalıştır
        const result = TestBed.runInInjectionContext(() =>
            authGuard({} as any, {} as any)
        );

        // Erişimi reddetmeli
        expect(result).toBe(false);

        // Login sayfasına yönlendirmeli
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
});