import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

export interface Favorite {
  productId: string;
  productName: string;
  price: number;
  mainImageUrl: string | null;
  addedAt: string;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = `${environment.apiUrl}/favorites`;

  // Global state: kullanıcının favori ürün ID'lerinin Set'i
  // Tüm product-card'lar buradan okur; tek bir GET ile N kart aydınlanır.
  private favoriteIdsSignal = signal<Set<string>>(new Set());
  readonly favoriteIds = this.favoriteIdsSignal.asReadonly();

  constructor() {
    // Login olunca otomatik yükle, logout olunca temizle
    effect(() => {
      const user = this.authService.currentUser();
      if (user?.id) {
        this.loadIds(user.id);
      } else {
        this.favoriteIdsSignal.set(new Set());
      }
    });
  }

  private loadIds(userId: string): void {
    this.http.get<Favorite[]>(`${this.baseUrl}/${userId}`).subscribe({
      next: (favs) => this.favoriteIdsSignal.set(new Set(favs.map(f => f.productId))),
      error: () => this.favoriteIdsSignal.set(new Set())
    });
  }

  isFavorite(productId: string): boolean {
    return this.favoriteIdsSignal().has(productId);
  }

  // Favorilerim sayfası için tam DTO listesini döner (Set yetmiyor — isim/fiyat/resim lazım)
  getByUserId(userId: string): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.baseUrl}/${userId}`).pipe(
      tap(favs => this.favoriteIdsSignal.set(new Set(favs.map(f => f.productId))))
    );
  }

  add(userId: string, productId: string): Observable<string> {
    return this.http.post<string>(this.baseUrl, { userId, productId }).pipe(
      tap(() => this.favoriteIdsSignal.update(ids => new Set(ids).add(productId)))
    );
  }

  remove(userId: string, productId: string): Observable<void> {
    return this.http.delete<void>(this.baseUrl, { body: { userId, productId } }).pipe(
      tap(() => this.favoriteIdsSignal.update(ids => {
        const next = new Set(ids);
        next.delete(productId);
        return next;
      }))
    );
  }
}
