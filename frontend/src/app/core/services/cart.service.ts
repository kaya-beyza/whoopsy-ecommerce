import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../features/products/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Reactive cart management using Angular Signals
  private cartItems = signal<Product[]>([]);
  
  // Hesaplanmış toplam ürün sayısı
  cartCount = computed(() => this.cartItems().length);

  // Sepete ürün ekle
  addToCart(product: Product) {
    this.cartItems.update(prev => [...prev, product]);
    console.log(`Cart: ${product.name} added successfully.`);
  }

  // Sepeti temizle
  clearCart() {
    this.cartItems.set([]);
  }

  // Mevcut ürünleri getir (Gelecekteki sepet sayfası entegrasyonu için)
  getItems() {
    return this.cartItems();
  }
}
