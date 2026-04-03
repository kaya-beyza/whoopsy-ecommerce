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



  // 2. KULLANICILAR SAYFASI
  {
    path: 'register',
    component: RegisterComponent
  },

  // 2. ANA ŞABLON (Tüm iç sayfalar bunun içinde derlenecek)
  {

    path: '',
    component: MainLayoutComponent, // 💡 Çatı burada kuruluyor
    children: [
      // ── ANA SAYFA ──
      {
        path: '',
        component: Home,
        pathMatch: 'full' // 👈 Bunu ekliyoruz ki diğer rotaları bozmasın
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

      // ── ÜRÜNLER (Product List) ──
      {
        path: 'urunler',
        loadChildren: () => import('./features/products/products.routes').then(m => m.routes)
      }
    ]
  },

  // 3. HATALI ROTA KONTROLÜ
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
    
    path: 'orders', // www. jadaksd/orders
    // canActivate: [authGuard],
    loadComponent: () => import('./features/orders/pages/order-list/order-list.component').then(m => m.OrderListComponent)
  },

  // 4. YENİ EKLENEN: ÜRÜN EKLEME SAYFASI
  {
    path: 'products/create',
    // İleride giriş yapmayanların ürün eklemesini engellemek için burayı da açabilirsin:
    // canActivate: [authGuard], 
    loadComponent: () => import('./features/products/pages/product-create/product-create.component').then(m => m.ProductCreateComponent)
  },

  // VARSAYILAN YÖNLENDİRME (En altta kalmalı)
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 

  }
];