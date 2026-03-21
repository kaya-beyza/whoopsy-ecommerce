import { Routes } from '@angular/router';
  import { LoginComponent } from './features/auth/pages/login/login.component';

  export const routes: Routes = [
    // /login adresine gidildiğinde LoginComponent'i göster
    { path: 'login', component: LoginComponent },

    // Ana sayfa (/) → şimdilik login'e yönlendir
    { path: '', redirectTo: 'login', pathMatch: 'full' }
  ];