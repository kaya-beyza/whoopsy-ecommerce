import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// /admin/dashboard gibi admin sayfalarını korur.
// JWT token'ından role claim'ini okur. Admin değilse /admin/login'e yönlendirir.
export const adminRoleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  if (user && user.role === 'Admin') {
    return true;
  }
  router.navigate(['/admin/login']);
  return false;
};
