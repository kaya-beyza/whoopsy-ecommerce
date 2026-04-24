import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../products/services/product.service';
import { Product } from '../products/models/product.model';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size: string;
  color: string;
}

// Eski RecommendedProduct arayüzünü sildik, çünkü artık servisten gelen gerçek Product modelini kullanacağız.

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit { // OnInit eklendi
  
  // Servisi içeri aktarıyoruz
  private productService = inject(ProductService);
  private router = inject(Router);

  cartItems = signal<CartItem[]>([]);

  // Yeni: Önerilen Ürünler Datası (Artık içi boş başlıyor, API'den dolacak)
  recommendedProducts = signal<Product[]>([]);

  shippingCost = signal<number>(49.99);

  subTotal = computed(() => this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0));
  total = computed(() => this.subTotal() > 0 ? this.subTotal() + this.shippingCost() : 0);

  ngOnInit(): void {
    this.productService.getCartRecommendations().subscribe({
      next: (products: Product[]) => {
        this.recommendedProducts.set(products);
      },
      error: (err: any) => {  // <-- BURAYA ': any' EKLENDİ
        console.error('Önerilen ürünler çekilirken hata oluştu:', err);
      }
    });
  }

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

  goToCheckout() {
    if (this.cartItems().length === 0) return;
    this.router.navigate(['/checkout'], {
      state: { cartItems: this.cartItems(), total: this.total() }
    });
  }

  addRecommendedToCart(product: Product) {
    this.cartItems.update(items => {
      const productIdStr = product.id.toString(); 
      
      const existingItem = items.find(i => i.id === productIdStr);
      if (existingItem) {
        return items.map(i => i.id === productIdStr ? { ...i, quantity: i.quantity + 1 } : i);
      }
      
      // return kelimesi bu blok için kritiktir, yoksa hata verir
      return [...items, {
        id: productIdStr,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
        size: 'Standart',
        color: product.colors && product.colors.length > 0 ? product.colors[0] : 'Standart' 
      }];
    });
  }

} // <-- EKSİK OLAN KAPANIŞ PARANTEZİ EKLENDİ