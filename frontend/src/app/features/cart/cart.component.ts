import { Component, computed, signal, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../products/services/product.service';
import { Product } from '../products/models/product.model';
import { CartService } from './services/cart.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

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
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  cartItems = signal<CartItem[]>([]);
  recommendedProducts = signal<Product[]>([]);
  shippingCost = signal<number>(49.99);

  subTotal = computed(() => this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0));
  total = computed(() => this.subTotal() > 0 ? this.subTotal() + this.shippingCost() : 0);

  // app-product-card cart'a ekleme yapınca cartService.cartCount değişir → cart listesini tazele
  private cartCountWatcher = effect(() => {
    const count = this.cartService.cartCount();
    if (count !== this.cartItems().length) {
      this.loadMyCart();
    }
  });

  ngOnInit(): void {
    this.loadMyCart();
    this.loadRecommendations();
  }

  loadMyCart() {
    this.cartService.getCartItems().subscribe({
      next: (backendItems) => {
        if (!backendItems || backendItems.length === 0) return;

        const mappedItems: CartItem[] = backendItems.map((item: any) => ({
          id: item.productId || item.ProductId, 
          name: item.productName || item.ProductName,
          price: item.price || item.Price,
          quantity: item.quantity || item.Quantity,
          imageUrl: item.mainImageUrl || item.MainImageUrl,
          size: item.size || 'Standart',
          color: item.color || 'Standart'
        }));

        this.cartItems.set(mappedItems);
      },
      error: (err) => console.error('Sepet çekilirken hata:', err)
    });
  }

  loadRecommendations() {
    this.productService.getCartRecommendations().subscribe({
      next: (products) => this.recommendedProducts.set(products),
      error: (err) => console.error('Öneriler yüklenemedi:', err)
    });
  }

  updateQuantity(id: string, delta: number) {
    const currentItems = this.cartItems();
    const itemToUpdate = currentItems.find(i => i.id === id);
    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity + delta;
    if (newQuantity < 1) return; 

    // Optimistik güncelleme
    this.cartItems.update(items =>
      items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );

    this.cartService.updateCartItem(id, newQuantity).subscribe({
      error: (err) => {
        console.error('Miktar güncellenemedi:', err);
        // Hata durumunda geri al
        this.cartItems.update(items =>
          items.map(item => item.id === id ? { ...item, quantity: itemToUpdate.quantity } : item)
        );
      }
    });
  }

  removeItem(id: string) {
    const previous = this.cartItems();
    // Optimistik: UI'dan hemen kaldır
    this.cartItems.update(items => items.filter(item => item.id !== id));

    this.cartService.removeItem(id).subscribe({
      error: () => this.cartItems.set(previous)  // Toast servis seviyesinde
    });
  }

  goToCheckout() {
    if (this.cartItems().length === 0) return;
    this.router.navigate(['/checkout'], {
      state: { cartItems: this.cartItems(), total: this.total() }
    });
  }

}