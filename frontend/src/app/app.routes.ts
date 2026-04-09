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
    path: 'orders',
    // canActivate: [authGuard],
    loadComponent: () => import('./features/orders/pages/order-list/order-list.component').then(m => m.OrderListComponent)
  },

  // 4. ÜRÜN EKLEME SAYFASI
  {
    path: 'products/create',
    // canActivate: [authGuard], 
    loadComponent: () => import('./features/products/pages/product-create/product-create.component').then(m => m.ProductCreateComponent)
  },

  // 5. SEPET SAYFASI (Lazy Loading ile)
  {
    path: 'cart',
    // canActivate: [authGuard], // İleride girişi zorunlu yapmak istersen açarsın
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
  },

  // VARSAYILAN YÖNLENDİRME 
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  }
];