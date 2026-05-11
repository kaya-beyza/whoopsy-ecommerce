import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService, Favorite } from '../../services/favorites.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-favorites-tab',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites-tab.component.html',
  styleUrls: ['./favorites-tab.component.css']
})
export class FavoritesTabComponent implements OnInit {
  private favoritesService = inject(FavoritesService);
  private authService = inject(AuthService);

  favorites = signal<Favorite[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');
  removingId = signal<string | null>(null);

  isEmpty = computed(() => !this.loading() && this.favorites().length === 0);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const user = this.authService.currentUser();
    if (!user?.id) {
      this.errorMessage.set('Oturum bilgisi okunamadı. Lütfen tekrar giriş yapın.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.favoritesService.getByUserId(user.id).subscribe({
      next: (data) => {
        this.favorites.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Favoriler yüklenirken bir sorun oluştu.');
        this.loading.set(false);
      }
    });
  }

  remove(productId: string): void {
    const user = this.authService.currentUser();
    if (!user?.id) return;

    this.removingId.set(productId);
    this.favoritesService.remove(user.id, productId).subscribe({
      next: () => {
        this.favorites.update(list => list.filter(f => f.productId !== productId));
        this.removingId.set(null);
      },
      error: () => {
        this.errorMessage.set('Favoriden çıkarılamadı, lütfen tekrar deneyin.');
        this.removingId.set(null);
      }
    });
  }

  imageOrPlaceholder(url: string | null): string {
    return url || '/assets/img/placeholder.png';
  }
}
