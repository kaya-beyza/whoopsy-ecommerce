import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateOrderRequest,
  CreatePaymentRequest,
  PaymentResponse
} from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private ordersUrl = `${environment.apiUrl}/Orders`;
  private paymentsUrl = `${environment.apiUrl}/Payments`;

  createOrder(request: CreateOrderRequest): Observable<string> {
    return this.http.post<string>(this.ordersUrl, request);
  }

  createPayment(request: CreatePaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(this.paymentsUrl, request);
  }
}
