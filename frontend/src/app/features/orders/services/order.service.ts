import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponse, MyOrder, MyOrderDetail } from '../models/order.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  // Admin: GET /api/Orders (hardcoded URL — mevcut admin /orders sayfası kullanıyor)
  private apiUrl = 'http://localhost:5277/api/Orders';

  // Kullanıcı tarafı: environment.apiUrl üzerinden
  private baseUrl = environment.apiUrl;

  getOrders(
    pageIndex: number,
    pageSize: number,
    status?: string,
    startDate?: string,
    endDate?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString());

    if (status) params = params.set('status', status);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<any>(this.apiUrl, { params });
  }

  // ─── Profil → Siparişlerim ────────────────────────────────
  // GET /api/users/{userId}/orders → giriş yapan kullanıcının sipariş geçmişi
  getMyOrders(userId: string): Observable<MyOrder[]> {
    return this.http.get<MyOrder[]>(`${this.baseUrl}/users/${userId}/orders`);
  }

  // GET /api/orders/{id} → tek sipariş detayı
  getById(orderId: string): Observable<MyOrderDetail> {
    return this.http.get<MyOrderDetail>(`${this.baseUrl}/orders/${orderId}`);
  }
}
