import { Component, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../products/services/product.service';
import { Product } from '../products/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  
  currentSlide = signal(0);
  isTransitioning = signal(false);
  private autoSlideInterval: any;
  featuredProducts = signal<Product[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.productService.getProducts(1, 8).subscribe({
      next: (data) => {
        this.featuredProducts.set(data.items);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.stopAutoSlide(); // Ensure no duplicates
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // 5 second banner transition
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  slides = [
    {
      id: 1,
      type: 'video',
      src: '/assets/images/video-1.mp4',
      tag: 'OOPS!',
      title: 'wh<span class="highlight">OOPS</span>y<br>ile',
      desc: 'sokak ruhunu tarzına yansıt.',
      link: '/urunler'
    },
    {
      id: 2,
      type: 'image',
      src: '/assets/images/hero-1.jpg',
      tag: 'NEW ERA',
      title: 'Modern<br>Zerafet',
      desc: 'Discover your freedom.',
      link: '/urunler'
    },
    {
      id: 3,
      type: 'image',
      src: '/assets/images/cat-man.jpg',
      tag: 'URBAN CORE',
      title: 'Sokağın<br>Ritmi',
      desc: 'New season collections now live.',
      link: '/urunler/kategori/019d53b6-10cf-78cd-97f1-99f5330f56db'
    },
    {
      id: 4,
      type: 'image',
      src: '/assets/images/cat-woman.jpg',
      tag: 'ESSENTIALS',
      title: 'İkonik<br>Çizgi',
      desc: 'Complete your style with premium accessories.',
      link: '/urunler/kategori/019d433e-9c19-771a-aee0-08812c0b5562'
    },
    {
      id: 5,
      type: 'image',
      src: '/assets/images/cat-child.jpg',
      tag: 'TINY STEPS',
      title: 'Çocuk<br>Dünyası',
      desc: 'Quality and style for the next generation.',
      link: '/urunler/kategori/019d53b6-4407-71e7-9b93-958477fe69d1'
    }
  ];

  nextSlide() {
    if (this.isTransitioning()) return;
    this.moveSlide((this.currentSlide() + 1) % this.slides.length);
  }

  prevSlide() {
    if (this.isTransitioning()) return;
    this.moveSlide((this.currentSlide() - 1 + this.slides.length) % this.slides.length);
  }

  setSlide(index: number) {
    if (this.isTransitioning() || this.currentSlide() === index) return;
    this.moveSlide(index);
  }

  private moveSlide(index: number) {
    this.isTransitioning.set(true);
    this.currentSlide.set(index);
    this.startAutoSlide(); // Reset timer on any movement

    // Synchronize with CSS transition duration (0.8s)
    setTimeout(() => {
      this.isTransitioning.set(false);
    }, 800);
  }
}