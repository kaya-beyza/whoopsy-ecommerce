import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size: string;
  color: string;
}

// Önerilen ürünler için yeni arayüz
interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  
  cartItems = signal<CartItem[]>([
    { id: '1', name: 'MINI DENIM ŞORT', price: 1490.00, quantity: 1, size: '36', color: 'Açık Mavi', imageUrl: 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?q=80&w=400&auto=format&fit=crop' },
    { id: '2', name: 'BASIC BEYAZ T-SHIRT', price: 349.99, quantity: 2, size: 'L', color: 'Beyaz', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop' }
  ]);

  // Yeni: Önerilen Ürünler Datası
  recommendedProducts = signal<RecommendedProduct[]>([
    { id: 'r1', name: 'SİYAH BLAZER CEKET', price: 2299.00, imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop' },
    { id: 'r2', name: 'GÜNEŞ GÖZLÜĞÜ', price: 599.90, imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&auto=format&fit=crop' },
    { id: 'r3', name: 'DERİ ÇAPRAZ ÇANTA', price: 1199.00, imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=400&auto=format&fit=crop' },
    { id: 'r4', name: 'BEYAZ SNEAKER', price: 1899.00, imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=400&auto=format&fit=crop' }
  ]);

  shippingCost = signal<number>(49.99);

  subTotal = computed(() => this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0));
  total = computed(() => this.subTotal() > 0 ? this.subTotal() + this.shippingCost() : 0);

  updateQuantity(id: string, delta: number) {
    this.cartItems.update(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  }

  removeItem(id: string) {
    this.cartItems.update(items => items.filter(item => item.id !== id));
  }

  // Yeni: Önerilen Ürünü Sepete Ekleme Metodu
  addRecommendedToCart(product: RecommendedProduct) {
    this.cartItems.update(items => {
      // Ürün zaten sepette var mı kontrol et
      const existingItem = items.find(i => i.id === product.id);
      if (existingItem) {
        return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      // Yoksa yeni ürün olarak ekle (Varsayılan beden/renk ile)
      return [...items, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
        size: 'Standart',
        color: 'Siyah/Beyaz'
      }];
    });
  }
}