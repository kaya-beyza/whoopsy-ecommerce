import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// Eğer order.model.ts içinde OrderResponse arayüzü tanımlıysa bu import kalabilir.
import { OrderResponse } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  
  // DÜZELTME 1: Endpoint adresinin sonuna '/Orders' eklendi.
  private apiUrl = 'http://localhost:5277/api/Orders';

  getOrders(
    pageIndex: number, 
    pageSize: number, 
    status?: string, 
    startDate?: string, 
    endDate?: string
  ): Observable<any> { // UYARI: Backend direkt veri dönüyorsa <any> yapmak daha güvenlidir
    
    // DÜZELTME 2: Backend 'page' ve 'size' bekliyor, 'pageIndex' ve 'pageSize' değil.
    let params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString());

    if (status) params = params.set('status', status);
    
    // Not: Backend controller'ında şu an startDate ve endDate yok. 
    // Buradan göndersin bile backend bunları şimdilik yok sayacaktır.
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<any>(this.apiUrl, { params });
  }
}