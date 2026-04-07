import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

    // TokenService'i DI ile al
    const tokenService = inject(TokenService);

    // localStorage'dan access token'ı oku
    const token = tokenService.getAccessToken();

    // Token varsa, isteğin header'ına ekle
    if (token) {
        // req (request) değiştirilemez (immutable), bu yüzden clone'layıp yeni header ekliyoruz.
        // Backend'e giden her istekte şu header gidecek:
        // Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
        const clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(clonedReq);
    }

    // Token yoksa (kullanıcı giriş yapmamış), isteği olduğu gibi gönder
    return next(req);
};