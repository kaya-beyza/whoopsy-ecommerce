import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { ProductService } from '../products/services/product.service'; 
import { Product } from '../products/models/product.model';
import { CartService } from './services/cart.service';

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
  imports: [CommonModule, RouterModule], 
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private router = inject(Router);

  // 3. Yönlendirme fonksiyonunu ekle
  goToCheckout() {
    // İleride buraya "sepet boş mu?" kontrolü ekleyebiliriz
    this.router.navigate(['/checkout']); 
  }
  
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  cartItems = signal<CartItem[]>([]);
  recommendedProducts = signal<Product[]>([]);
  shippingCost = signal<number>(49.99);

  subTotal = computed(() => this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0));
  total = computed(() => this.subTotal() > 0 ? this.subTotal() + this.shippingCost() : 0);

  ngOnInit(): void {
    // 1. Sayfa açıldığında sepeti getir
    this.loadMyCart();

    // 2. Önerilen ürünleri getir
    this.productService.getCartRecommendations().subscribe({
      next: (products: Product[]) => {
        this.recommendedProducts.set(products);
      },
      error: (err: any) => { 
        console.error('Önerilen ürünler çekilirken hata oluştu:', err);
      }
    });
  }

  // ───── SEPETİ GETİRME VE TEŞHİS FONKSİYONU ─────
  loadMyCart() {
    this.cartService.getCartItems().subscribe({
      next: (backendItems) => {
        // DİKKAT: Sorunu bulacağımız satır burası!
        console.log("Backend'den gelen ham veri:", backendItems);

        if (!backendItems || backendItems.length === 0) {
          console.warn("Backend boş dizi döndürdü. Sepet gerçekten boş veya userId eşleşmiyor.");
          return;
        }

        const mappedItems: CartItem[] = backendItems.map((item: any) => {
          // Gelen verinin özelliklerini konsola yazdırıyoruz
          console.log("İşlenen ürünün özellikleri:", Object.keys(item));

          return {
            id: item.productId || item.ProductId, 
            name: item.productName || item.ProductName,
            price: item.price || item.Price,
            quantity: item.quantity || item.Quantity,
            imageUrl: item.mainImageUrl || item.MainImageUrl,
            size: 'Standart',
            color: 'Standart'
          };
        });

        // Verileri Angular'ın sinyaline yüklüyoruz ki HTML bunu görüp tabloyu çizsin
        this.cartItems.set(mappedItems);
      },
      error: (err) => {
        console.error('Sepet çekilirken hata:', err);
      }
    });
  }

  updateQuantity(id: string, delta: number) {
    const currentItems = this.cartItems();
    const itemToUpdate = currentItems.find(i => i.id === id);
    
    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity + delta;
    
    // Miktar 1'den az olamaz (Silmek için çarpı butonunu kullanmalı)
    if (newQuantity < 1) return; 

    // 1. Kullanıcıyı bekletmemek için anında ekrandaki sayıyı güncelliyoruz
    this.cartItems.update(items =>
      items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );

    // 2. Yeni miktarı veritabanına kaydediyoruz
    this.cartService.updateCartItem(id, newQuantity).subscribe({
      next: () => {
        console.log(`Ürün miktarı veritabanında başarıyla ${newQuantity} yapıldı.`);
      },
      error: (err) => {
        console.error('Miktar güncellenirken hata oluştu:', err);
        // Backend'de hata olursa, sayıyı ekranda da gizlice eski haline (orijinaline) geri çeviriyoruz
        this.cartItems.update(items =>
          items.map(item => item.id === id ? { ...item, quantity: itemToUpdate.quantity } : item)
        );
        alert('Stok miktarı güncellenemedi.');
      }
    });
  }

  removeItem(id: string) {
    this.cartItems.update(items => items.filter(item => item.id !== id));
  }

  addRecommendedToCart(product: Product) {
    const productIdStr = product.id.toString(); 

    this.cartService.addToCart(productIdStr, 1).subscribe({
      next: (response) => {
        console.log('Ürün backend sepetine eklendi!', response);

        this.cartItems.update(items => {
          const existingItem = items.find(i => i.id === productIdStr);
          if (existingItem) {
            return items.map(i => i.id === productIdStr ? { ...i, quantity: i.quantity + 1 } : i);
          }
          
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
      },
      error: (err) => {
        console.error('Sepete eklenirken backend hatası:', err);
        alert(err.message || 'Ürünü sepete eklerken bir sorun oluştu.');
      }
    });
  }
}