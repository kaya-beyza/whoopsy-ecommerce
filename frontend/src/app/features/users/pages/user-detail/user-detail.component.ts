/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserDto, OrderDto, OrderStatus } from '../../models/user.model';

@Component({
    selector: 'app-user-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-detail.component.html',
    styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {

    // Kullanıcı bilgisi — backend'den gelecek
    // null ile başlıyor çünkü henüz veri yok
    user: UserDto | null = null;

    // Sipariş listesi
    orders: OrderDto[] = [];

    loading: boolean = true;
    errorMessage: string = '';

    // ActivatedRoute → URL'deki parametreleri okumak için (id)
    // Router → geri butonu için (listeye dönmek)
    // UserService → backend'den veri çekmek için
    constructor(
        private route: ActivatedRoute, //(/users/abc-123). ActivatedRoute o zarfı açıp "hedef kim?" (abc-123) diye okuyan postacı. Bu     
                                       //id'yi alıp backend'e "bana bu kullanıcıyı ver" diyoruz.
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        // URL'den id parametresini al
        // /users/abc-123 → id = 'abc-123'
        this.route.params.subscribe(params => {
            const userId = params['id'];
            this.loadUser(userId);
            this.loadOrders(userId);
        });
    }

    // Kullanıcı bilgisini çek
    loadUser(id: string): void {
        this.userService.getById(id).subscribe({
            next: (data) => {
                this.user = data;
                this.loading = false;
            },
            error: (err) => {
                this.errorMessage = 'Kullanıcı bilgisi yüklenemedi.';
                this.loading = false;
                console.error('Kullanıcı detay hatası:', err);
            }
        });
    }

    // Sipariş geçmişini çek
    loadOrders(userId: string): void {
        this.userService.getOrderHistory(userId).subscribe({
            next: (data) => {
                this.orders = data;
            },
            error: (err) => {
                console.error('Sipariş geçmişi hatası:', err);
            }
        });
    }

    // OrderStatus enum'unu Türkçe metne çevir
    // Backend 0,1,2,3,4 gibi sayı gönderiyor
    // Biz ekranda "Beklemede", "Kargoda" gibi göstermek istiyoruz
    getStatusText(status: OrderStatus): string {
        const statusMap: Record<number, string> = { // Record TypeScript'te bir sözlük (dictionary) tipi.
            [OrderStatus.Pending]: 'Beklemede',
            [OrderStatus.Confirmed]: 'Onaylandı',
            [OrderStatus.Shipped]: 'Kargoda',
            [OrderStatus.Delivered]: 'Teslim Edildi',
            [OrderStatus.Cancelled]: 'İptal Edildi'
        };
        return statusMap[status] || 'Bilinmiyor';
    }

    // Listeye geri dön
    goBack(): void {
        this.router.navigate(['/users']);
    }
}*/

// Mock Veri ile 


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserDto, OrderDto, OrderStatus } from '../../models/user.model';

@Component({
    selector: 'app-user-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-detail.component.html',
    styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {

    user: UserDto | null = null;
    orders: OrderDto[] = [];
    loading: boolean = true;
    errorMessage: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const userId = params['id'];
            this.loadUser(userId);
            this.loadOrders(userId);
        });
    }

    loadUser(id: string): void {
        // ───── GEÇİCİ MOCK VERİ ─────
        // Backend hazır olunca bu bloğu SİL ve alttaki subscribe'ı aç!
        const mockUsers: Record<string, UserDto> = {
            '1a2b3c4d': {
                id: '1a2b3c4d',
                fullName: 'Ahmet Yılmaz',
                email: 'ahmet@mail.com',
                isActive: true,
                roleName: 'Admin',
                createdDate: '2026-01-15T10:30:00'
            },
            '5e6f7g8h': {
                id: '5e6f7g8h',
                fullName: 'Elif Kaya',
                email: 'elif@mail.com',
                isActive: true,
                roleName: 'User',
                createdDate: '2026-02-20T14:00:00'
            },
            '9i0j1k2l': {
                id: '9i0j1k2l',
                fullName: 'Mehmet Demir',
                email: 'mehmet@mail.com',
                isActive: false,
                roleName: 'User',
                createdDate: '2026-03-05T09:15:00'
            }
        };

        const found = mockUsers[id];
        if (found) {
            this.user = found;
            this.loading = false;
        } else {
            this.errorMessage = 'Kullanıcı bulunamadı.';
            this.loading = false;
        }
        return;
        // ───── GEÇİCİ MOCK VERİ SON ─────

        this.userService.getById(id).subscribe({
            next: (data) => {
                this.user = data;
                this.loading = false;
            },
            error: (err) => {
                this.errorMessage = 'Kullanıcı bilgisi yüklenemedi.';
                this.loading = false;
                console.error('Kullanıcı detay hatası:', err);
            }
        });
    }

    loadOrders(userId: string): void {
        // ───── GEÇİCİ MOCK VERİ ─────
        const mockOrders: Record<string, OrderDto[]> = {
            '1a2b3c4d': [
                {
                    id: 'order-001',
                    totalAmount: 15500,
                    status: OrderStatus.Shipped,
                    shippingAddress: 'İstanbul, Kadıköy',
                    createdDate: '2026-03-20T11:00:00',
                    orderItems: [
                        { productId: 'p1', productName: 'Laptop', quantity: 1, unitPrice: 15000, totalPrice: 15000 },
                        { productId: 'p2', productName: 'Mouse', quantity: 2, unitPrice: 250, totalPrice: 500 }
                    ]
                },
                {
                    id: 'order-002',
                    totalAmount: 3200,
                    status: OrderStatus.Delivered,
                    shippingAddress: 'İstanbul, Beşiktaş',
                    createdDate: '2026-02-10T09:30:00',
                    orderItems: [
                        { productId: 'p3', productName: 'Klavye', quantity: 1, unitPrice: 1200, totalPrice: 1200 },
                        { productId: 'p4', productName: 'Kulaklık', quantity: 1, unitPrice: 2000, totalPrice: 2000 }
                    ]
                }
            ],
            '5e6f7g8h': [
                {
                    id: 'order-003',
                    totalAmount: 850,
                    status: OrderStatus.Pending,
                    shippingAddress: 'Ankara, Çankaya',
                    createdDate: '2026-03-22T16:45:00',
                    orderItems: [
                        { productId: 'p5', productName: 'Telefon Kılıfı', quantity: 3, unitPrice: 150, totalPrice: 450 },
                        { productId: 'p6', productName: 'Ekran Koruyucu', quantity: 2, unitPrice: 200, totalPrice: 400 }
                    ]
                }
            ],
            '9i0j1k2l': []
        };

        this.orders = mockOrders[userId] || [];
        return;
        // ───── GEÇİCİ MOCK VERİ SON ─────

        this.userService.getOrderHistory(userId).subscribe({
            next: (data) => {
                this.orders = data;
            },
            error: (err) => {
                console.error('Sipariş geçmişi hatası:', err);
            }
        });
    }

    getStatusText(status: OrderStatus): string {
        const statusMap: Record<number, string> = {
            [OrderStatus.Pending]: 'Beklemede',
            [OrderStatus.Confirmed]: 'Onaylandı',
            [OrderStatus.Shipped]: 'Kargoda',
            [OrderStatus.Delivered]: 'Teslim Edildi',
            [OrderStatus.Cancelled]: 'İptal Edildi'
        };
        return statusMap[status] || 'Bilinmiyor';
    }

    goBack(): void {
        this.router.navigate(['/users']);
    }
}
