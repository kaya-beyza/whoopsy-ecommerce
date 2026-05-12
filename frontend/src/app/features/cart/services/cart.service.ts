import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, tap, catchError, of } from 'rxjs';
import { TokenService } from '../../../core/services/token.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:5277/api/cart';

  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private notify = inject(NotificationService);

  // Header badge'i bu signal'a bağlı. addToCart/removeItem sonrası güncelleniyor.
  cartCount = signal<number>(0);

  // App başlangıcında ya da login sonrası çağrılır; backend'den gerçek sayıyı çekip senkronize eder.
  refreshCartCount(): void {
    const userId = this.tokenService.getUserIdFromToken();
    if (!userId) {
      this.cartCount.set(0);
      return;
    }
    this.http.get<any[]>(`${this.apiUrl}/${userId}`).pipe(
      catchError(() => of([]))
    ).subscribe(items => this.cartCount.set(items?.length ?? 0));
  }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    const userId = this.tokenService.getUserIdFromToken();

    if (!userId) {
      return throwError(() => new Error('Sepete ürün eklemek için lütfen giriş yapın.'));
    }

    const payload = { userId, productId, quantity };

    return this.http.post(this.apiUrl, payload).pipe(
      tap(() => {
        this.refreshCartCount();
        this.notify.show('Sepete eklendi', 'success', { label: 'Sepete git', route: '/cart' });
      }),
      catchError(err => {
        this.notify.show('Ürün sepete eklenemedi', 'error');
        return throwError(() => err);
      })
    );
  }

  getCartItems(): Observable<any[]> {
    const userId = this.tokenService.getUserIdFromToken();
    if (!userId) {
      return throwError(() => new Error('Kullanıcı girişi yapılmamış.'));
    }
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`).pipe(
      tap(items => this.cartCount.set(items?.length ?? 0))
    );
  }

  updateCartItem(productId: string, quantity: number): Observable<any> {
    const userId = this.tokenService.getUserIdFromToken();
    if (!userId) {
      return throwError(() => new Error('Kullanıcı girişi yapılmamış.'));
    }
    const payload = { userId, productId, quantity };
    return this.http.put(this.apiUrl, payload);
  }

  removeItem(productId: string): Observable<any> {
    const userId = this.tokenService.getUserIdFromToken();
    if (!userId) {
      return throwError(() => new Error('Kullanıcı girişi yapılmamış.'));
    }
    // DELETE /api/cart, body içinde { userId, productId } — backend RemoveFromCartCommand bekliyor.
    return this.http.delete(this.apiUrl, { body: { userId, productId } }).pipe(
      tap(() => {
        this.refreshCartCount();
        this.notify.show('Sepetten çıkarıldı', 'info');
      }),
      catchError(err => {
        this.notify.show('Ürün silinemedi', 'error');
        return throwError(() => err);
      })
    );
  }
}
