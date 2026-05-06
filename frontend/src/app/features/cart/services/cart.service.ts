import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// YOL DÜZELTİLDİ: 3 kademe geri gidip core klasörüne ulaşıyor
import { TokenService } from '../../../core/services/token.service'; 

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  // Backend API adresi
  private apiUrl = 'http://localhost:5277/api/cart'; 

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    const userId = this.tokenService.getUserIdFromToken();

    if (!userId) {
      console.error("Kullanıcı girişi yapılmamış!");
      return throwError(() => new Error('Sepete ürün eklemek için lütfen giriş yapın.'));
    }

    const payload = {
      userId: userId,
      productId: productId,
      quantity: quantity
    };

    return this.http.post(this.apiUrl, payload);
  }

  // ───── SEPETİ VERİTABANINDAN GETİR ─────
  getCartItems(): Observable<any[]> {
    const userId = this.tokenService.getUserIdFromToken();
    
    if (!userId) {
      return throwError(() => new Error('Kullanıcı girişi yapılmamış.'));
    }

    // Genelde backend'ler kullanıcı kimliğini Token'dan anlar veya URL'den ID bekler.
    // Eğer backend GET /api/Cart adresinden okuyorsa bu yeterlidir. 
    // (Eğer backend URL'de ID bekliyorsa burayı `${this.apiUrl}/${userId}` yapacağız)
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`); 
  }

  // ───── SEPETTEKİ ÜRÜN MİKTARINI GÜNCELLE ─────
  updateCartItem(productId: string, quantity: number): Observable<any> {
    const userId = this.tokenService.getUserIdFromToken();
    
    if (!userId) {
      return throwError(() => new Error('Kullanıcı girişi yapılmamış.'));
    }

    const payload = {
      userId: userId,
      productId: productId,
      quantity: quantity
    };

    // NOT: REST API standartlarına göre güncelleme işlemleri genelde PUT isteğiyle yapılır.
    return this.http.put(this.apiUrl, payload);
  }
  
}