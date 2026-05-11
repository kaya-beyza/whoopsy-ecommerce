import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenService = inject(TokenService);
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = tokenService.getAccessToken();

    const handled = token
        ? next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))
        : next(req);

    return handled.pipe(
        catchError((err: unknown) => {
            // Token elimizde vardı ama backend reddetti → expired/invalid.
            // Sessiz logout + login'e yönlendir; aksi halde form boş kalır ve
            // kullanıcı "Profil bilgileri yüklenemedi" gibi anlamsız hatalar görür.
            if (err instanceof HttpErrorResponse && err.status === 401 && token) {
                authService.logout();
                router.navigate(['/login']);
            }
            return throwError(() => err);
        })
    );
};
