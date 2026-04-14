import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../products/services/product.service';
import { Product } from '../products/models/product.model';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  
  currentSlide = 0;
  private autoSlideInterval: any;
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

    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.stopAutoSlide(); // Ensure no duplicates
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Whomopsy asaletinde 5 saniyelik geçiş
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
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
      title: 'Asalet<br>Sokakta',
      desc: 'Whomopsy ile özgürlüğünü keşfet.',
      link: '/urunler'
    },
    {
      id: 3,
      type: 'image',
      src: '/assets/images/cat-man.jpg',
      tag: 'URBAN CORE',
      title: 'Sokağın<br>Ritmi',
      desc: 'Yeni sezon erkek koleksiyonu Whomopsy tesciliyle yayında.',
      link: '/urunler/kategori/019d53b6-10cf-78cd-97f1-99f5330f56db'
    },
    {
      id: 4,
      type: 'image',
      src: '/assets/images/cat-woman.jpg',
      tag: 'ESSENTIALS',
      title: 'İkonik<br>Çizgi',
      desc: 'Tarzını Whomopsy aksesuarlarının gücüyle tamamla.',
      link: '/urunler/kategori/019d433e-9c19-771a-aee0-08812c0b5562'
    },
    {
      id: 5,
      type: 'image',
      src: '/assets/images/cat-child.jpg',
      tag: 'TINY STEPS',
      title: 'Minik<br>Asalet',
      desc: 'Çocuklar için Whomopsy şıklığı her dikişte hissedilir.',
      link: '/urunler/kategori/019d53b6-4407-71e7-9b93-958477fe69d1'
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
    this.startAutoSlide(); // Reset timer on manual click
  }
}