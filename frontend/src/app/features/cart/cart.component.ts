import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Sepetteki ürünlerin veri modeli
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size: string;
  color: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  // Örnek ürünler (Gerçek projede bir servisten yüklenecek)
  cartItems = signal<CartItem[]>([
    { 
      id: '1', 
      name: 'MINI DENIM ŞORT', 
      price: 1490.00, 
      quantity: 1, 
      size: '36', 
      color: 'Açık Mavi', 
      // Not: image_11.png'den ilham alan görsel
      imageUrl: 'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?q=80&w=400&auto=format&fit=crop' 
    },
    { 
      id: '2', 
      name: 'BASIC BEYAZ T-SHIRT', 
      price: 349.99, 
      quantity: 2, 
      size: 'L', 
      color: 'Beyaz', 
      // Not: image_10.png'den ilham alan görsel
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop' 
    }
  ]);

  shippingCost = signal<number>(49.99);

  // Ara Toplam Hesaplama (computed Signals ile otomatik)
  subTotal = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  });

  // Genel Toplam Hesaplama (computed Signals ile otomatik)
  total = computed(() => {
    const currentSub = this.subTotal();
    return currentSub > 0 ? currentSub + this.shippingCost() : 0;
  });

  // Miktar Artırma / Azaltma
  updateQuantity(id: string, delta: number) {
    this.cartItems.update(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }; // 1'in altına düşmesin
        }
        return item;
      })
    );
  }

  // Ürün Silme
  removeItem(id: string) {
    this.cartItems.update(items => items.filter(item => item.id !== id));
  }
}