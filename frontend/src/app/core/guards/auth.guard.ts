 import { CanActivateFn, Router } from '@angular/router';
  import { inject } from '@angular/core';
  import { TokenService } from '../services/token.service';

  export const authGuard: CanActivateFn = (route, state) => {

    // DI ile servisleri al
    const tokenService = inject(TokenService);
    const router = inject(Router);

    // Kullanıcı giriş yapmış mı kontrol et
    if (tokenService.isLoggedIn()) {
      // Token var → sayfaya erişime izin ver
      return true;
    }
    // Token yok → login sayfasına yönlendir
    router.navigate(['/login']);
    return false;
  };