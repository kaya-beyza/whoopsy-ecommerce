import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../features/products/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { inject } from '@angular/core';

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
  
  // Active visual index for the image slider
  activeImageIndex = signal(0);
  isQuickAddVisible = signal(false);

  // Gösterilecek görseller (ilk 3 fotoğraf ile sınırolıyoruz - SuperStep Style)
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
    const width = rect.width;
    
    // Kartın genişliğini görsel sayısına göre bölüyoruz
    const sectionWidth = width / images.length;
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
}
