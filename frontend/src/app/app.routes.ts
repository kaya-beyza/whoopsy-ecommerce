import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { Home } from './features/home/home';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  // 1. GİRİŞ SAYFASI (Layout Dışında - Sade Sayfa)
  {
    path: 'login',
    component: LoginComponent
  },

  // 2. KAYIT SAYFASI (Layout Dışında - Sade Sayfa)
  {
    path: 'register',
    component: RegisterComponent
  },

  // 3. ANA ŞABLON (Tüm iç sayfalar bunun içinde derlenecek)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // ── ANA SAYFA ──
      {
        path: '',
        component: Home,
        pathMatch: 'full'
      },

      // ── KULLANICILAR ──
      {
        path: 'users',
        canActivate: [authGuard],
        loadChildren: () => import('./features/users/users.routes').then(m => m.userRoutes)
      },

      // ── SİPARİŞLER ──
      {
        path: 'orders',
        // canActivate: [authGuard],
        loadComponent: () => import('./features/orders/pages/order-list/order-list.component').then(m => m.OrderListComponent)
      },

      // ── ÜRÜNLER LİSTESİ ──
      {
        path: 'urunler',
        loadChildren: () => import('./features/products/products.routes').then(m => m.routes)
      },

      // ── ÜRÜN EKLEME SAYFASI (Senin dalından geldi) ──
      {
        path: 'products/create',
        // canActivate: [authGuard], 
        loadComponent: () => import('./features/products/pages/product-create/product-create.component').then(m => m.ProductCreateComponent)
      },

      // ── SEPET SAYFASI (Senin dalından geldi) ──
      {
        path: 'cart',
        // canActivate: [authGuard], 
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
      },

      // ── ÖDEME SAYFASI (Checkout) ──
      {
        path: 'checkout',
        // canActivate: [authGuard], // Kullanıcıların sadece giriş yaparak ödeme yapmasını istersen bunu aktif edebilirsin
        loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent)
      }
    ]
  },

  // 4. HATALI ROTA KONTROLÜ (Bilinmeyen bir URL girilirse anasayfaya atar)
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];