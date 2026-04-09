import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list-with-brand',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="brand-viewport">
      <div class="content">
        <!-- ── BOUTIQUE HEADER ── -->
        <header class="brand-hero">
          <div class="container">
            <nav class="breadcrumb-trail">
              <a routerLink="/">Anasayfa</a>
              <span>/</span>
              <a routerLink="/urunler">Mağaza</a>
              <span>/</span>
              <span class="active">{{ brandName() }}</span>
            </nav>
            
            <div class="title-block">
              <h1 class="brand-display-name">{{ brandName() | uppercase }}</h1>
              <div class="identity-line"></div>
              <p class="boutique-label">Whoopsy Elite+ Collection</p>
            </div>
          </div>
        </header>

        <div class="container main-content">
          <!-- ── BRANDED SILENT LOADER ── -->
          <div class="shimmer-box" *ngIf="isLoading()">
              <div class="eyes-loader-identity">
                <span class="eye-o-logo">O</span>
                <span class="eye-o-logo">O</span>
              </div>
          </div>

          <!-- ── CLEAN SLATE (No products) ── -->
          <div class="clean-slate" *ngIf="!isLoading() && products().length === 0">
          </div>

          <!-- ── BOUTIQUE GRID ── -->
          <div class="product-grid" *ngIf="!isLoading() && products().length > 0">
            <div class="elite-product-card" *ngFor="let p of products()" [routerLink]="['/urunler/detay', p.id]">
              <div class="card-media">
                <img [src]="p.imageUrl" [alt]="p.name" class="main-image" />
                <div class="card-badges">
                  <span class="badge-new" *ngIf="p.isNew">YENİ</span>
                </div>
                <button class="wishlist-btn">
                  <span class="material-symbols-sharp">favorite</span>
                </button>
              </div>
              <div class="card-info">
                <div class="info-top">
                  <span class="p-brand">{{ p.brand }}</span>
                </div>
                <h3 class="p-name">{{ p.name }}</h3>
                <div class="p-price-row">
                  <span class="p-price">{{ p.price | currency:'TRY':'symbol-narrow':'1.0-0' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .brand-viewport {
      min-height: 90vh;
      background: #fff;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 40px;
    }

    /* ── BRAND HERO STYLING ── */
    .brand-hero {
      padding: 100px 0 60px;
      text-align: center;
      background: linear-gradient(to bottom, #fcfcfc, #fff);
      border-bottom: 1px solid #f0f0f0;

      .breadcrumb-trail {
        display: flex;
        justify-content: center;
        gap: 12px;
        font-size: 11px;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #999;
        margin-bottom: 40px;
        
        a { color: #999; text-decoration: none; transition: color 0.3s; }
        a:hover { color: #000; }
        .active { color: #000; font-weight: 700; }
      }

      .title-block {
        position: relative;
        display: inline-block;
        
        .brand-display-name {
          font-family: var(--font-logo);
          font-size: 64px;
          letter-spacing: 8px;
          font-weight: 400;
          color: #000;
          margin: 0;
          line-height: 1;
        }
        
        .identity-line {
          width: 60px;
          height: 2px;
          background: #000;
          margin: 20px auto;
        }

        .boutique-label {
          font-size: 13px;
          letter-spacing: 4px;
          color: #bbb;
          text-transform: uppercase;
          margin: 0;
        }
      }
    }

    .main-content {
      padding: 60px 0 100px;
    }

    /* ── BRANDED SILENT LOADER STYLING ── */
    .shimmer-box {
      text-align: center;
      padding: 120px 0;
      
      .eyes-loader-identity {
        display: flex;
        justify-content: center;
        gap: 12px;
        animation: whoopsyShake 3s infinite ease-in-out;

        .eye-o-logo {
          font-family: var(--font-logo);
          font-size: 85px;
          color: var(--color-primary);
          line-height: 1;
          position: relative;
          display: inline-block;
          
          &::after {
            content: '';
            position: absolute;
            width: 14px;
            height: 14px;
            background: #000;
            border-radius: 50%;
            top: 50%;
            left: 35%;
            transform: translate(-50%, -50%);
            animation: whoopsyLookLogo 4s infinite ease-in-out;
          }
        }
      }
    }

    /* ── PRODUCT GRID STYLING ── */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 40px;
    }
    .elite-product-card {
      cursor: pointer;
      .card-media {
        position: relative;
        overflow: hidden;
        aspect-ratio: 4/5;
        background: #f9f9f9;
        border-radius: 4px;
        img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
        &:hover img { transform: scale(1.08); }
      }
      .card-info {
        padding: 25px 0;
        .p-brand { font-size: 11px; font-weight: 700; color: #bbb; letter-spacing: 1.5px; text-transform: uppercase; }
        .p-name { font-size: 16px; margin: 10px 0; color: #333; letter-spacing: 0.5px; }
        .p-price { font-size: 15px; font-weight: 800; color: #000; }
      }
    }

    .card-badges { position: absolute; top: 20px; left: 20px; }
    .badge-new { background: #000; color: #fff; padding: 5px 12px; font-size: 10px; font-weight: 800; border-radius: 2px; letter-spacing: 1px; }
    .wishlist-btn { position: absolute; top: 20px; right: 20px; background: transparent; border: none; color: #ddd; cursor: pointer; transition: color 0.3s; &:hover { color: #000; } }

    @keyframes whoopsyLookLogo {
      0%, 100% { transform: translate(-50%, -50%); }
      25% { transform: translate(-20%, -60%); }
      50% { transform: translate(-70%, -40%); }
      75% { transform: translate(-20%, -40%); }
    }
    @keyframes whoopsyShake {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `]
})
export class ProductListWithBrandComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  brandName = signal('');
  products = signal<Product[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const brand = params['brand'];
      this.brandName.set(brand);
      this.loadProducts(brand);
    });
  }

  loadProducts(brand: string): void {
    this.isLoading.set(true);
    this.productService.getProductsByBrand(brand).subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}