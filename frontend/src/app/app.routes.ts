import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 1. GİRİŞ SAYFASI
  { 
    path: 'login', 
    component: LoginComponent 
  },

  // 2. KULLANICILAR SAYFASI
  {
    path: 'users',
    canActivate: [authGuard],
    loadChildren: () => import('./features/users/users.routes').then(m => m.userRoutes)
  },

  // 3. SİPARİŞLER SAYFASI 
  {
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