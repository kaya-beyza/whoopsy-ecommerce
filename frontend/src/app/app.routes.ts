import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { Home } from './features/home/home';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  // 1. GİRİŞ SAYFASI (Layout Dışında)
  {
    path: 'login',
    component: LoginComponent
  },

  // 2. KAYIT SAYFASI (Layout Dışında)
  {
    path: 'register',
    component: RegisterComponent
  },

  // 2.5. ADMİN AKIŞI (Layout dışında — kendi tam ekran sayfaları var)
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },

  // 3. ANA ŞABLON (Tüm iç sayfalar MainLayout içinde)
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
        loadComponent: () => import('./features/orders/pages/order-list/order-list.component').then(m => m.OrderListComponent)
      },

      // ── PROFİL (Sekmeli sayfa: Profilim / Siparişlerim / Favorilerim / Şifre) ──
      {
        path: 'profile',
        canActivate: [authGuard],
        loadChildren: () => import('./features/profile/profile.routes').then(m => m.profileRoutes)
      },

      // ── ÜRÜNLER LİSTESİ ──
      {
        path: 'urunler',
        loadChildren: () => import('./features/products/products.routes').then(m => m.routes)
      },

      // ── ÜRÜN EKLEME SAYFASI ──
      {
        path: 'products/create',
        loadComponent: () => import('./features/products/pages/product-create/product-create.component').then(m => m.ProductCreateComponent)
      },

      // ── SEPET SAYFASI ──
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
      },

      // ── ÖDEME / CHECKOUT (Birleştirilmiş Karar) ──
      {
        path: 'checkout',
        // canActivate: [authGuard], // Ödeme için login zorunluysa aktif et
        // Eğer tek bir component ise loadComponent, alt rotaların varsa loadChildren kullanmalısın.
        // Projenin yapısına göre main dalındaki loadChildren genelde daha doğrudur:
        loadChildren: () => import('./features/checkout/checkout.routes').then(m => m.checkoutRoutes)
      }
    ]
  },

  // 4. HATALI ROTA KONTROLÜ
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];