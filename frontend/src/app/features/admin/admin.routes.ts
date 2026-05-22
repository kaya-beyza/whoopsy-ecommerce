import { Routes } from '@angular/router';
import { adminGateGuard } from '../../core/guards/admin-gate.guard';
import { adminRoleGuard } from '../../core/guards/admin-role.guard';

// Admin akışı 4 sayfa:
//  - /admin/gate     → erişim şifresi (gate password). Doğru girilince register ve login'e kapı açılır.
//  - /admin/register → başvuru formu (adminGateGuard arkasında).
//  - /admin/login    → admin girişi (adminGateGuard arkasında). Defense in depth: gate + kendi şifresi.
//  - /admin/dashboard→ yönetim paneli (adminRoleGuard arkasında).
export const adminRoutes: Routes = [
  {
    path: 'gate',
    loadComponent: () =>
      import('./pages/admin-gate/admin-gate.component').then(m => m.AdminGateComponent)
  },
  {
    path: 'register',
    canActivate: [adminGateGuard],
    loadComponent: () =>
      import('./pages/admin-register/admin-register.component').then(m => m.AdminRegisterComponent)
  },
  {
    path: 'login',
    canActivate: [adminGateGuard],
    loadComponent: () =>
      import('./pages/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [adminRoleGuard],
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
