import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../products/services/product.service';
import { Product } from '../products/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  
  currentSlide = 0;
  featuredProducts = signal<Product[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        // En öncelikli 8 ürünü vitrine çıkartıyoruz
        this.featuredProducts.set(products.slice(0, 8));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  slides = [
    {
      id: 1,
      type: 'video',
      src: 'assets/images/video-1.mp4',
      tag: 'OOPS!',
      title: 'whOOPSy<br>ile',
      desc: 'sokak ruhunu ayağına taşı.',
      link: '/urunler'
    },
    {
      id: 2,
      type: 'image',
      src: 'assets/images/hero-1.jpg',
      tag: '',
      title: '',
      desc: '',
      link: '/urunler'
    }
  ];

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  setSlide(index: number) {
    this.currentSlide = index;
  }
}