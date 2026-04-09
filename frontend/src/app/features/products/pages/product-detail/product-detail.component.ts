import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

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

  addToCart(): void {
    if (!this.selectedSize()) {
      alert('Lütfen bir beden seçiniz.');
      return;
    }
    console.log('Sepete eklendi:', this.product()?.name, 'Beden:', this.selectedSize());
  }
}
