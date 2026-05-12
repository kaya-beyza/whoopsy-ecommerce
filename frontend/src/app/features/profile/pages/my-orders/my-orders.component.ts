import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../orders/services/order.service';
import { MyOrder, OrderStatus } from '../../../orders/models/order.model';
import { AuthService } from '../../../../core/services/auth.service';

// Status enum (Pending/Confirmed/Shipped/Delivered/Cancelled) → Türkçe etiket + badge class
const STATUS_META: Record<OrderStatus, { label: string; cssClass: string }> = {
    Pending:         { label: 'Bekliyor',         cssClass: 'badge-warning' },
    Confirmed:       { label: 'Onaylandı',        cssClass: 'badge-info' },
    Shipped:         { label: 'Kargolandı',       cssClass: 'badge-primary' },
    Delivered:       { label: 'Teslim Edildi',    cssClass: 'badge-success' },
    Cancelled:       { label: 'İptal Edildi',     cssClass: 'badge-danger' },
    ReturnRequested: { label: 'İade Bekliyor',    cssClass: 'badge-warning' },
    ReturnApproved:  { label: 'İade Onaylandı',   cssClass: 'badge-info' },
    ReturnRejected:  { label: 'İade Reddedildi',  cssClass: 'badge-danger' },
    Returned:        { label: 'İade Tamamlandı',  cssClass: 'badge-success' },
  };

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  orders = signal<MyOrder[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  isEmpty = computed(() => !this.loading() && this.orders().length === 0);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user?.id) {
      this.errorMessage.set('Oturum bilgisi okunamadı. Lütfen tekrar giriş yapın.');
      this.loading.set(false);
      return;
    }

    this.orderService.getMyOrders(user.id).subscribe({
      next: (data) => {
        // En yeni sipariş en üstte
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
        this.orders.set(sorted);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Siparişler yüklenirken bir sorun oluştu.');
        this.loading.set(false);
      }
    });
  }

  statusLabel(status: OrderStatus): string {
    return STATUS_META[status]?.label ?? status;
  }

  statusClass(status: OrderStatus): string {
    return STATUS_META[status]?.cssClass ?? 'badge-default';
  }

  firstItemImage(order: MyOrder): string {
    return order.orderItems?.[0]?.imageUrl || '/assets/img/placeholder.png';
  }

  itemCount(order: MyOrder): number {
    return order.orderItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  }
}
