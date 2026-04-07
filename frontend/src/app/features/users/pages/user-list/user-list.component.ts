/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../models/user.model';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

    // Kullanıcı listesini tutacak değişken
    users: UserDto[] = [];

    // Yükleniyor durumu — veri gelene kadar "Yükleniyor..." göstermek için
    loading: boolean = true;

    // Hata mesajı — bir şey ters giderse kullanıcıya göstermek için
    errorMessage: string = '';

    // DI ile UserService ve Router'ı inject ediyoruz
    // UserService → backend'den veri çekmek için
    // Router → kullanıcıya tıklanınca detay sayfasına yönlendirmek için
    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    // OnInit → Component ekrana ilk yüklendiğinde çalışır
    // Login'de constructor içinde bir şey yapmamıştık çünkü kullanıcının
    // form doldurmasını bekliyorduk. Burada sayfa açılır açılmaz veri çekmemiz lazım.
    ngOnInit(): void {
        this.loadUsers();
    }

    // Kullanıcıları backend'den çeken metod
    loadUsers(): void {
        this.loading = true;
        this.errorMessage = '';

        this.userService.getAll().subscribe({
            // Başarılı → gelen veriyi users dizisine at
            next: (data) => {
                this.users = data;
                this.loading = false;
            },
            // Hata → hata mesajını göster
            error: (err) => {
                this.errorMessage = 'Kullanıcılar yüklenirken bir hata oluştu.';
                this.loading = false;
                console.error('Kullanıcı listesi hatası:', err);
            }
        });
    }

    // Tabloda bir satıra tıklanınca çalışır
    // Kullanıcının id'siyle detay sayfasına yönlendirir
    goToDetail(userId: string): void {
        this.router.navigate(['/users', userId]);
    }
}*/

// Mock veri ile

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../models/user.model';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

    users: UserDto[] = [];
    loading: boolean = true;
    errorMessage: string = '';

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.errorMessage = '';

        // ───── GEÇİCİ MOCK VERİ ─────
        // Backend hazır olmadığı için sahte veri kullanıyoruz
        // ÖNEMLİ: Backend bağlanınca bu bloğu SİL ve alttaki subscribe'ı aç!
        this.users = [
            {
                id: '1a2b3c4d',
                fullName: 'Ahmet Yılmaz',
                email: 'ahmet@mail.com',
                isActive: true,
                roleName: 'Admin',
                createdDate: '2026-01-15T10:30:00'
            },
            {
                id: '5e6f7g8h',
                fullName: 'Elif Kaya',
                email: 'elif@mail.com',
                isActive: true,
                roleName: 'User',
                createdDate: '2026-02-20T14:00:00'
            },
            {
                id: '9i0j1k2l',
                fullName: 'Mehmet Demir',
                email: 'mehmet@mail.com',
                isActive: false,
                roleName: 'User',
                createdDate: '2026-03-05T09:15:00'
            }
        ];
        this.loading = false;
        return;
        // ───── GEÇİCİ MOCK VERİ SON ─────

        // Gerçek API çağrısı — backend hazır olunca üstteki mock bloğunu sil
        // ve bu kısmın yorumunu kaldır (return'ü de sil)
        this.userService.getAll().subscribe({
            next: (data) => {
                this.users = data;
                this.loading = false;
            },
            error: (err) => {
                this.errorMessage = 'Kullanıcılar yüklenirken bir hata oluştu.';
                this.loading = false;
                console.error('Kullanıcı listesi hatası:', err);
            }
        });
    }

    goToDetail(userId: string): void {
        this.router.navigate(['/users', userId]);
    }
}