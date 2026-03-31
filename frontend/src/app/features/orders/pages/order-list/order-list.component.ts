import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);

  // Veri Yönetimi
  orders: Order[] = [];
  isLoading = true;
  errorMessage = '';

  // Filtreler
  selectedStatus = '';
  startDate = '';
  endDate = '';

  // Sayfalama
  pageIndex = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 1;

  // YENİ: Toplu İşlem (Bulk Actions) için seçilen siparişlerin ID'lerini tuttuğumuz küme
  selectedOrderIds: Set<string> = new Set();

  // YENİ: Toast Bildirimleri (Sağ üstten çıkan baloncuklar)
  toasts: { id: number, message: string, type: 'success' | 'error' }[] = [];
  private toastIdCounter = 0;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.errorMessage = '';
    this.selectedOrderIds.clear(); // Yeni sayfa yüklenince seçimleri sıfırla

    this.orderService.getOrders(this.pageIndex, this.pageSize, this.selectedStatus, this.startDate, this.endDate)
      .subscribe({
        next: (response) => {
          this.orders = response.items;
          this.totalCount = response.totalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
          // Yükleme efektini (Skeleton) tam görebilmen için çok kısa bir gecikme ekledik
          setTimeout(() => this.isLoading = false, 600); 
        },
        error: (err) => {
          this.errorMessage = 'Siparişler yüklenirken bir sorun oluştu.';
          this.isLoading = false;
          this.showToast('Sunucu ile bağlantı kurulamadı!', 'error');
        }
      });
  }

  // YENİ: Zarif Bildirim Gösterme Fonksiyonu
  showToast(message: string, type: 'success' | 'error') {
    const id = this.toastIdCounter++;
    this.toasts.push({ id, message, type });
    // 3 saniye (3000ms) sonra bildirimi ekrandan otomatik sil
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 3000);
  }

  // Tekil Durum Güncelleme
  updateStatus(orderId: string, event: any) {
    const newStatus = event.target.value;
    // Normalde burada this.orderService.updateOrderStatus(...) çağrılır
    this.showToast(`#${orderId.substring(0,6)} numaralı sipariş '${newStatus}' olarak güncellendi.`, 'success');
  }

  // YENİ: Tablodaki "Tümünü Seç" kutucuğunun mantığı
  get isAllSelected() {
    return this.orders.length > 0 && this.selectedOrderIds.size === this.orders.length;
  }

  toggleAll(event: any) {
    if (event.target.checked) {
      this.orders.forEach(o => this.selectedOrderIds.add(o.id));
    } else {
      this.selectedOrderIds.clear();
    }
  }

  toggleSelection(orderId: string, event: any) {
    if (event.target.checked) {
      this.selectedOrderIds.add(orderId);
    } else {
      this.selectedOrderIds.delete(orderId);
    }
  }

  // YENİ: Seçilenleri Toplu Olarak Güncelle
  bulkUpdate(status: string) {
    if (this.selectedOrderIds.size === 0) return;
    this.showToast(`${this.selectedOrderIds.size} adet sipariş başarıyla '${status}' yapıldı.`, 'success');
    this.selectedOrderIds.clear(); // İşlem bitince seçimleri kaldır
  }

  applyFilters() {
    this.pageIndex = 1;
    this.loadOrders();
  }

  clearFilters() {
    this.selectedStatus = '';
    this.startDate = '';
    this.endDate = '';
    this.applyFilters();
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.pageIndex = newPage;
      this.loadOrders();
    }
  }
}