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

  // Dinamik Cinsiyet ID'leri (Re-seed dostu ritim 🧿)
  kadinId = signal<string | null>(null);
  erkekId = signal<string | null>(null);
  cocukId = signal<string | null>(null);

  ngOnInit(): void {
    this.productService.getProducts(1, 8).subscribe({
      next: (data) => {
        this.featuredProducts.set(data.items);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    // Güncel Kimlikleri Yakalama Mührü 🛡️
    this.productService.getCategoryTree().subscribe(categories => {
      const flatten = (arr: any[]): any[] => arr.reduce((acc, c) => acc.concat(c, c.subCategories ? flatten(c.subCategories) : (c.SubCategories ? flatten(c.SubCategories) : [])), []);
      const allCats = flatten(categories);
      
      // Pusuya karşı korumalı (Case-insensitive) eşleştirme 🛡️
      const kadinCat = allCats.find(c => (c.name === 'Kadın' || c.Name === 'Kadın'));
      const erkekCat = allCats.find(c => (c.name === 'Erkek' || c.Name === 'Erkek'));
      const cocukCat = allCats.find(c => (c.name === 'Çocuk' || c.Name === 'Çocuk'));
      
      this.kadinId.set(kadinCat?.id || kadinCat?.Id || null);
      this.erkekId.set(erkekCat?.id || erkekCat?.Id || null);
      this.cocukId.set(cocukCat?.id || cocukCat?.Id || null);
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
      src: 'https://res.cloudinary.com/dkwthtwgg/video/upload/q_auto/f_auto/v1776068582/video-1_kajrcq.mp4',
      tag: 'OOPS!',
      title: 'wh<span class="highlight">OOPS</span>y<br>ile',
      desc: 'sokak ruhunu tarzına yansıt.',
      link: '/urunler'
    },
    {
      id: 2,
      type: 'image',
      src: 'https://res.cloudinary.com/dkwthtwgg/image/upload/q_auto/f_auto/v1777372179/header-5_hwheir.png',
      tag: 'NEW ERA',
      title: 'Modern<br>Zerafet',
      desc: 'Discover your freedom.',
      link: '/urunler'
    },
    {
      id: 3,
      type: 'image',
      src: 'https://res.cloudinary.com/dkwthtwgg/image/upload/q_auto/f_auto/v1777372010/header-2_dtewun.webp',
      tag: 'URBAN CORE',
      title: 'Sokağın<br>Ritmi',
      desc: 'New season collections now live.',
      link: '/urunler'
    },
    {
      id: 4,
      type: 'image',
      src: 'https://res.cloudinary.com/dkwthtwgg/image/upload/q_auto/f_auto/v1777034862/hero-7_df2pju.jpg',
      tag: 'ESSENTIALS',
      title: 'İkonik<br>Çizgi',
      desc: 'Complete your style with premium accessories.',
      link: '/urunler'
    },
    {
      id: 5,
      type: 'image',
      src: 'https://res.cloudinary.com/dkwthtwgg/image/upload/q_auto/f_auto/v1777372036/header-3_ovju27.jpg',
      tag: 'TINY STEPS',
      title: 'Çocuk<br>Dünyası',
      desc: 'Quality and style for the next generation.',
      link: '/urunler'
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