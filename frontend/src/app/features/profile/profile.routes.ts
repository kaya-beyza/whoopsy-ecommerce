import { Routes } from '@angular/router';
import { ProfileLayoutComponent } from './layout/profile-layout.component';

export const profileRoutes: Routes = [
  {
    path: '',
    component: ProfileLayoutComponent,
    children: [
      // Default → /profile açıldığında otomatik /profile/me
      { path: '', redirectTo: 'me', pathMatch: 'full' },

      // /profile/me
      {
        path: 'me',
        loadComponent: () =>
          import('./pages/profile-tab/profile-tab.component')
            .then(m => m.ProfileTabComponent)
      }

      // Diğer tab'ler (orders, favorites, change-password) sonraki adımlarda eklenecek
    ]
  }
];
