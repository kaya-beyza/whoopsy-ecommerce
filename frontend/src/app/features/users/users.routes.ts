import { Routes } from '@angular/router';
  import { UserListComponent } from './pages/user-list/user-list.component';
  import { UserDetailComponent } from './pages/user-detail/user-detail.component';

  export const userRoutes: Routes = [
    // /users → kullanıcı listesi
    { path: '', component: UserListComponent },

    // /users/abc-123 → kullanıcı detayı
    // :id → dinamik parametre. URL'deki değer ne olursa olsun yakalar.
    // ActivatedRoute ile component içinde bu id'yi okuyoruz (route.params['id'])
    { path: ':id', component: UserDetailComponent }
  ];