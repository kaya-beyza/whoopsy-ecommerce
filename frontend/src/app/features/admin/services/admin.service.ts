import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminRegisterRequest, GatePasswordRequest } from '../../../core/models/auth.model';

// Backend'deki AdminController endpoint'lerini saran HTTP servisi.
@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiUrl}/Admin`;
  private http = inject(HttpClient);

  // Gate password doğrulama — sadece "doğru mu?" kontrol eder.
  verifyGate(request: GatePasswordRequest): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(`${this.apiUrl}/verify-gate`, request);
  }

  // Admin başvurusu. Backend onay maili yollar; cevap olarak userId döner.
  register(request: AdminRegisterRequest): Observable<{ userId: string; message: string }> {
    return this.http.post<{ userId: string; message: string }>(`${this.apiUrl}/register`, request);
  }
}
