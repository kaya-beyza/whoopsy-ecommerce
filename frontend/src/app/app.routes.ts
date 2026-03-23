import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
 import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // /users → userRoutes'u yükle (lazy loading ile)
  // canActivate: [authGuard] → giriş yapmamış kullanıcı bu sayfaya gidemez
  // loadChildren → users.routes.ts dosyasını sadece ihtiyaç olunca yükler (performans)
  {
    path: 'users',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/users/users.routes').then(m => m.userRoutes)
  },

  // Varsayılan yol → login'e yönlendir
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];