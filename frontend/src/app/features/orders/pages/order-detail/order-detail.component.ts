import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { MyOrderDetail, OrderStatus } from '../../models/order.model';

const STATUS_META: Record<OrderStatus, { label: string; cssClass: string }> = {
  Pending:   { label: 'Bekliyor',      cssClass: 'badge-warning' },
  Confirmed: { label: 'Onaylandı',     cssClass: 'badge-info' },
  Shipped:   { label: 'Kargolandı',    cssClass: 'badge-primary' },
  Delivered: { label: 'Teslim Edildi', cssClass: 'badge-success' },
  Cancelled: { label: 'İptal Edildi',  cssClass: 'badge-danger' },
};

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order = signal<MyOrderDetail | null>(null);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('Geçersiz sipariş kimliği.');
      this.loading.set(false);
      return;
    }

    this.orderService.getById(id).subscribe({
      next: (data) => {
        this.order.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err?.status === 404
            ? 'Sipariş bulunamadı.'
            : 'Sipariş bilgileri yüklenirken bir sorun oluştu.'
        );
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

  imageOrPlaceholder(url: string): string {
    return url || '/assets/img/placeholder.png';
  }
}
