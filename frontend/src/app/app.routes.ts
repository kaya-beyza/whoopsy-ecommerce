import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 1. GİRİŞ SAYFASI
  { 
    path: 'login', 
    component: LoginComponent 
  },

  // 
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

  
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  }
];