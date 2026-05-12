import { Component, Input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../../features/products/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { FavoritesService } from '../../../features/profile/services/favorites.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  activeImageIndex = signal(0);
  isQuickAddVisible = signal(false);
  isFavoriteBusy = signal(false);

  // Favorideki ürünleri tutan global Set'e bakar — toggle anında tüm kartlar senkron
  // Not: Product.id model'da number ama backend Guid string döndürüyor (model tipi pre-existing bug)
  isFavorite = computed(() => this.favoritesService.favoriteIds().has(String(this.product.id)));

  displayImages = computed(() => {
    if (!this.product.images || this.product.images.length === 0) {
      return [this.product.imageUrl];
    }
    return this.product.images.slice(0, 3);
  });

  onMouseMove(event: MouseEvent): void {
    const images = this.displayImages();
    if (images.length <= 1) return;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const sectionWidth = rect.width / images.length;
    const index = Math.floor(x / sectionWidth);

    if (index >= 0 && index < images.length) {
      this.activeImageIndex.set(index);
    }
  }

  onMouseLeave(): void {
    this.activeImageIndex.set(0);
    this.isQuickAddVisible.set(false);
  }

  toggleQuickAdd(event: Event): void {
    event.stopPropagation();
    this.isQuickAddVisible.update(v => !v);
  }

  addToCart(size: string | number, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(this.product);
    this.isQuickAddVisible.set(false);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();

    const user = this.authService.currentUser();
    if (!user?.id) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isFavoriteBusy()) return;
    this.isFavoriteBusy.set(true);

    const productId = String(this.product.id);
    const done = () => this.isFavoriteBusy.set(false);

    if (this.isFavorite()) {
      this.favoritesService.remove(user.id, productId).subscribe({ next: done, error: done });
    } else {
      this.favoritesService.add(user.id, productId).subscribe({ next: done, error: done });
    }
  }
}
