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
      },

      // /profile/orders → siparişlerim
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/my-orders/my-orders.component')
            .then(m => m.MyOrdersComponent)
      },

      // /profile/orders/:id → sipariş detayı
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('../orders/pages/order-detail/order-detail.component')
            .then(m => m.OrderDetailComponent)
      },

      // /profile/favorites → favorilerim
      {
        path: 'favorites',
        loadComponent: () =>
          import('./pages/favorites-tab/favorites-tab.component')
            .then(m => m.FavoritesTabComponent)
      },

      // /profile/change-password → şifre değiştir (placeholder, sonraki adım)
      {
        path: 'change-password',
        loadComponent: () =>
          import('./pages/change-password-tab/change-password-tab.component')
            .then(m => m.ChangePasswordTabComponent)
      }
    ]
  }
];
