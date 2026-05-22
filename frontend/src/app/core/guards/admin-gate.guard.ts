import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AdminGateService } from '../../features/admin/services/admin-gate.service';

// /admin/register sayfasını korur. Gate password verify edilmediyse /admin/gate'e yönlendirir.
export const adminGateGuard: CanActivateFn = () => {
  const gateService = inject(AdminGateService);
  const router = inject(Router);

  if (gateService.isVerified()) {
    return true;
  }
  router.navigate(['/admin/gate']);
  return false;
};
