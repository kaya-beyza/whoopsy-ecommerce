import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router'; // <-- Router eklendi
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

// DİKKAT: CartService'in yolunu kendi klasör yapına göre düzeltmen gerekebilir.
// Eğer bu sayfa products/pages içindeyse yol muhtemelen şöyledir:
import { CartService } from '../../../cart/services/cart.service'; 

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss' // styleUrl Angular 17+ özelliğidir, doğru kullanılmış.
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  
  // YENİ EKLENEN SERVİSLER
  private cartService = inject(CartService);
  private router = inject(Router);

  product = signal<Product | null>(null);
  isLoading = signal(true);
  hasError = signal(false);

  // Görsel ve Beden Seçimi
  selectedImage = signal<string>('');
  selectedSize = signal<string | number | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.product.set(prod);
        this.selectedImage.set(prod.imageUrl);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Whoopsy Detay Getirilemedi!', err);
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  selectImage(url: string): void {
    this.selectedImage.set(url);
  }

  selectSize(size: string | number): void {
    this.selectedSize.set(size);
  }

  // GÜNCELLENEN SEPETE EKLEME VE YÖNLENDİRME FONKSİYONU
  addToCart(): void {
    if (!this.selectedSize()) {
      alert('Lütfen bir beden seçiniz.');
      return;
    }

    const currentProduct = this.product();
    if (!currentProduct) return;

    // Backend'e ürünü ekleme isteği atıyoruz
    this.cartService.addToCart(currentProduct.id.toString(), 1).subscribe({
      next: (response) => {
        console.log('Ürün sepete başarıyla eklendi:', currentProduct.name, 'Beden:', this.selectedSize());
        
        // İşlem başarılı olunca kullanıcıyı Sepet sayfasına yönlendiriyoruz
        this.router.navigate(['/cart']);
      },
      error: (err) => {
        console.error('Sepete eklenirken hata:', err);
        alert(err.message || 'Ürünü sepete eklerken bir sorun oluştu. Lütfen giriş yaptığınızdan emin olun.');
      }
    });
  }
}