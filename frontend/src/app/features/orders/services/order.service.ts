import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponse } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:5001/api/orders';

  // GetOrdersQuery'yi tetikleyecek metod
  getOrders(
    pageIndex: number, 
    pageSize: number, 
    status?: string, 
    startDate?: string, 
    endDate?: string
  ): Observable<OrderResponse> {
    
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    if (status) params = params.set('status', status);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<OrderResponse>(this.apiUrl, { params });
  }
}