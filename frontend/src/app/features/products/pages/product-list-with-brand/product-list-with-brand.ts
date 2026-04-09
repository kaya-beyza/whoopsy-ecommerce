import { Component, OnInit, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, FilterGroup } from '../../models/product.model';

@Component({
  selector: 'app-product-list-with-brand',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="shop-container" [class.filter-open]="isFilterVisible()">
        <!-- Top Breadcrumb: Elegant Top-Left -->
        <div class="breadcrumb-container">
            <ng-container *ngFor="let item of breadcrumbItems(); let last = last">
                <span [class.active]="last">{{ item }}</span>
                <span *ngIf="!last"> / </span>
            </ng-container>
        </div>

        <!-- Main Header: Centered & Bold -->
        <header class="shop-header">
            <h1 class="category-name">{{ brandName() | uppercase }}</h1>
            <p class="boutique-label">Whoopsy Elite+ Collection</p>
        </header>

        <!-- Controls Bar: Multi-Functional -->
        <div class="controls-bar">
            <div class="left-controls">
                <button class="filter-toggle-btn" (click)="toggleFilter()">
                    <span class="material-symbols-sharp">{{ isFilterVisible() ? 'filter_list_off' : 'filter_list' }}</span>
                    <span>{{ isFilterVisible() ? 'Filtreleri Gizle' : 'Filtreleri Göster' }}</span>
                </button>
                <div class="v-divider"></div>
                <span class="product-count">{{ products().length }} Ürün Listeleniyor</span>
            </div>

            <!-- Dynamic Filter Chips -->
            <div class="active-filters" *ngIf="selectedFilters().length > 0">
                <div class="filter-chip" *ngFor="let filter of selectedFilters()">
                    <span class="chip-label">{{ filter.group }}:</span>
                    <span class="chip-value">{{ filter.option }}</span>
                    <button class="remove-chip" (click)="removeFilter(filter)">
                        <span class="material-symbols-sharp">close</span>
                    </button>
                </div>
                <button class="clear-all-link" (click)="clearFilters()">Filtreleri Temizle</button>
            </div>

            <div class="right-controls">
                <div class="custom-sort" [class.open]="isSortOpen()" (click)="$event.stopPropagation()">
                    <div class="sort-trigger" (click)="toggleSort()">
                        <span class="sort-label">Sırala:</span>
                        <span class="selected-value">{{ selectedSort().label }}</span>
                        <span class="material-symbols-sharp sort-icon">expand_more</span>
                    </div>

                    <ul class="sort-dropdown" *ngIf="isSortOpen()">
                        <li *ngFor="let option of sortOptions" [class.active]="selectedSort().value === option.value"
                            (click)="selectSort(option)">
                            {{ option.label }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <main class="products-layout" [class.sidebar-hidden]="!isFilterVisible()">
            <!-- Sidebar -->
            <aside class="filter-sidebar" [class.active]="isFilterVisible()">
                <div class="filter-content">
                    <div class="filter-group" *ngFor="let group of filterGroups()">
                        <div class="group-header" (click)="toggleFilterGroup(group)">
                            <span>{{ group.name }}</span>
                            <span class="material-symbols-sharp">{{ group.isExpanded ? 'remove' : 'add' }}</span>
                        </div>
                        <div class="group-options" [class.expanded]="group.isExpanded">
                            <!-- Special UI for Color Swatches -->
                            <div class="color-swatch-grid" *ngIf="group.key === 'color'; else standardOptions">
                                <button *ngFor="let opt of group.options" class="swatch-item"
                                    [class.active]="isSelected(group.name, opt)"
                                    [class.light]="opt === 'Beyaz' || opt === 'Kemik' || opt === 'Krem'" [title]="opt"
                                    (click)="onFilterToggle(group.name, opt)" [style.background-color]="getColorHex(opt)">
                                </button>
                            </div>

                            <!-- Standard Checkbox Options -->
                            <ng-template #standardOptions>
                                <label class="option-item" *ngFor="let opt of group.options">
                                    <input type="checkbox" [checked]="isSelected(group.name, opt)"
                                        (change)="onFilterToggle(group.name, opt)">
                                    <span class="custom-checkbox"></span>
                                    <span class="option-text">{{ opt }}</span>
                                </label>
                            </ng-template>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Products Grid Area -->
            <section class="products-grid-area">
                <div class="products-grid">
                    <!-- Loading Skeletons -->
                    <ng-container *ngIf="isLoading()">
                        <div class="skeleton-card" *ngFor="let i of [1,2,3,4,5,6,7,8]">
                            <div class="skeleton-image"></div>
                            <div class="skeleton-text short"></div>
                            <div class="skeleton-text long"></div>
                        </div>
                    </ng-container>

                    <!-- Actual Product Cards -->
                    <ng-container *ngIf="!isLoading()">
                        <div class="product-card" *ngFor="let product of products()"
                            (mouseleave)="setQuickAddProduct(null)">

                            <div class="card-image-wrapper">
                                <span class="badge bestseller" *ngIf="product.isBestseller">BESTSELLER</span>
                                <span class="badge new" *ngIf="product.isNew">YENİ</span>
                                <span class="badge discount" *ngIf="product.discountLabel">{{ product.discountLabel
                                    }}</span>

                                <button class="wishlist-btn">
                                    <span class="material-symbols-sharp">favorite</span>
                                </button>

                                <img [src]="product.imageUrl" [alt]="product.name" class="main-img">
                                <div class="quick-plus-trigger" (click)="setQuickAddProduct(product.id)">
                                    <span class="material-symbols-sharp">add</span>
                                </div>

                                <div class="quick-size-selector" [class.active]="quickAddProductId() === product.id">
                                    <p class="quick-add-title">HIZLI EKLE</p>
                                    <div class="sizes-grid">
                                        <button *ngFor="let size of product.sizes" (click)="addToCart(product, size)"
                                            class="size-btn">
                                            {{ size }}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="card-info">
                                <p class="brand-name">{{ product.brand }}</p>
                                <h3 class="product-title">{{ product.name }}</h3>
                                <div class="price-row">
                                    <span class="original-price" *ngIf="product.originalPrice">{{ product.originalPrice |
                                        number:'1.0-0' }} TL</span>
                                    <span class="current-price" [class.discounted]="product.originalPrice">{{ product.price
                                        |
                                        number:'1.0-0' }} TL</span>
                                </div>
                            </div>
                        </div>
                    </ng-container>
                </div>
            </section>
        </main>
    </div>
  `,
  styles: [`
    .shop-container {
      padding: 120px 0 0;
      background: #fff;
      min-height: 100vh;
      transition: padding-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* ── Elegant Breadcrumb ── */
    .breadcrumb-container {
        padding: 0 40px;
        margin-bottom: 20px;
        display: flex;
        gap: 8px;
        font-size: 11px;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #999;
        
        a { color: #999; text-decoration: none; &:hover { color: #000; } }
        .active { color: #000; font-weight: 700; }
    }

    /* ── Shop Header ── */
    .shop-header {
      text-align: center;
      padding: 20px 40px 40px;
      .category-name {
        font-family: var(--font-logo);
        font-size: 48px;
        font-weight: 400;
        letter-spacing: 4px;
        color: #000;
        margin: 0;
      }
      .boutique-label {
        font-size: 12px;
        letter-spacing: 3px;
        color: #bbb;
        text-transform: uppercase;
        margin-top: 10px;
      }
    }

    /* ── Controls Bar ── */
    .controls-bar {
      position: sticky;
      top: 80px;
      z-index: 100;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 40px;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;

      .left-controls {
        display: flex;
        align-items: center;
        gap: 20px;
        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: 0.3s;
          &:hover { opacity: 0.7; }
        }
        .v-divider { width: 1px; height: 20px; background: #eee; }
        .product-count { font-size: 12px; color: #999; }
      }

      .active-filters {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 20px;
        flex-wrap: wrap;

        .filter-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8f8f8;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 11px;
          .chip-label { font-weight: 700; color: #999; }
          .remove-chip {
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            .material-symbols-sharp { font-size: 14px; }
          }
        }
        .clear-all-link {
          background: none;
          border: none;
          font-size: 11px;
          font-weight: 800;
          text-decoration: underline;
          cursor: pointer;
          color: #000;
        }
      }

      .right-controls {
        .custom-sort {
          position: relative;
          .sort-trigger {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 13px;
            .sort-label { color: #999; }
            .selected-value { font-weight: 700; }
            .sort-icon { font-size: 20px; transition: 0.3s; }
          }
          &.open .sort-icon { transform: rotate(180deg); }
          
          .sort-dropdown {
            position: absolute;
            top: calc(100% + 15px);
            right: 0;
            background: #fff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            border-radius: 8px;
            list-style: none;
            padding: 10px;
            min-width: 200px;
            li {
              padding: 12px 15px;
              font-size: 13px;
              cursor: pointer;
              border-radius: 6px;
              &:hover { background: #f9f9f9; }
              &.active { font-weight: 800; color: #000; background: #f5f5f5; }
            }
          }
        }
      }
    }

    /* ── Main Layout ── */
    .products-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      &.sidebar-hidden { grid-template-columns: 0px 1fr; }
    }

    /* ── Sidebar ── */
    .filter-sidebar {
      height: calc(100vh - 130px);
      position: sticky;
      top: 130px;
      overflow-y: auto;
      border-right: 1px solid #f0f0f0;
      opacity: 1;
      visibility: visible;
      transition: 0.4s;
      &.active { width: 320px; padding: 40px; }
      &:not(.active) { opacity: 0; visibility: hidden; width: 0; }

      .filter-group {
        margin-bottom: 30px;
        .group-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 10px 0;
          &:hover { opacity: 0.7; }
        }
        .group-options {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          &.expanded { max-height: 500px; padding-top: 15px; }
          
          .option-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 0;
            cursor: pointer;
            input { display: none; }
            .custom-checkbox {
              width: 18px;
              height: 18px;
              border: 1px solid #ddd;
              border-radius: 4px;
              position: relative;
            }
            input:checked + .custom-checkbox {
              background: #000;
              border-color: #000;
              &::after {
                content: '';
                position: absolute;
                left: 5px; top: 2px;
                width: 5px; height: 10px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
              }
            }
            .option-text { font-size: 13px; color: #666; }
          }
        }
      }
    }

    /* ── Color Swatch Grid (Visual Filter) ── */
    .color-swatch-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 12px;
        padding-bottom: 15px;

        .swatch-item {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 1px solid rgba(0,0,0,0.05);
            cursor: pointer;
            position: relative;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            padding: 0;

            &:hover {
                transform: scale(1.15);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            &.active {
                transform: scale(1.1);
                box-shadow: 0 0 0 2px #fff, 0 0 0 4px #000;
                z-index: 2;
            }

            &.light {
                border: 1px solid #eee;
            }
        }
    }

    /* ── Grid Area ── */
    .products-grid-area {
      padding: 40px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 30px;
    }

    /* ── Product Card ── */
    .product-card {
      .card-image-wrapper {
        position: relative;
        aspect-ratio: 4/5;
        background: #fcfcfc;
        overflow: hidden;
        border-radius: 4px;

        .main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
        }

        &:hover .main-img { transform: scale(1.05); }

        .badge {
          position: absolute;
          top: 15px;
          left: 15px;
          font-size: 9px;
          font-weight: 800;
          padding: 5px 10px;
          border-radius: 2px;
          letter-spacing: 1px;
          z-index: 10;
        }
        .bestseller { background: #000; color: #fff; }
        .new { background: #fff; color: #000; border: 1px solid #eee; }
        .discount { background: #ff3b30; color: #fff; }

        .wishlist-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          color: #eee;
          cursor: pointer;
          transition: 0.3s;
          z-index: 10;
          &:hover { color: #000; }
          .material-symbols-sharp { font-size: 22px; font-variation-settings: 'FILL' 0; }
        }

        .quick-plus-trigger {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transform: translateY(10px);
          transition: 0.4s;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          z-index: 10;
        }

        &:hover .quick-plus-trigger { opacity: 1; transform: translateY(0); }

        .quick-size-selector {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          padding: 20px;
          transform: translateY(100%);
          transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 20;
          &.active { transform: translateY(0); }

          .quick-add-title {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1.5px;
            margin-bottom: 15px;
            text-align: center;
          }
          .sizes-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            .size-btn {
              background: #fff;
              border: 1px solid #eee;
              padding: 8px 0;
              font-size: 11px;
              cursor: pointer;
              transition: 0.3s;
              &:hover { background: #000; color: #fff; border-color: #000; }
            }
          }
        }
      }

      .card-info {
        padding: 20px 0;
        .brand-name { font-size: 11px; font-weight: 800; color: #bbb; letter-spacing: 1.5px; margin-bottom: 5px; text-transform: uppercase; }
        .product-title { font-size: 15px; margin: 0 0 10px; color: #333; font-weight: 400; line-height: 1.4; }
        .price-row {
          display: flex;
          gap: 12px;
          align-items: center;
          .current-price { font-weight: 800; font-size: 14px; }
          .original-price { font-size: 12px; color: #999; text-decoration: line-through; }
          .discounted { color: #ff3b30; }
        }
      }
    }

    /* ── Skeletons ── */
    .skeleton-card {
      .skeleton-image { width: 100%; aspect-ratio: 4/5; background: #f5f5f5; border-radius: 4px; margin-bottom: 15px; }
      .skeleton-text { height: 12px; background: #f5f5f5; border-radius: 2px; margin-bottom: 10px; }
      .skeleton-text.short { width: 40%; }
      .skeleton-text.long { width: 80%; }
    }
  `]
})
export class ProductListWithBrandComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  brandName = signal('');
  products = signal<Product[]>([]);
  isLoading = signal(true);
  isFilterVisible = signal(true);
  quickAddProductId = signal<number | null>(null);

  // Dinamik Breadcrumb
  breadcrumbItems = signal(['Anasayfa', 'Markalar', '']);

  // Filters
  selectedFilters = signal<{ group: string, option: string }[]>([]);

  filterGroups = signal<FilterGroup[]>([
    { name: 'Cinsiyet', key: 'gender', options: ['Kadın', 'Erkek', 'Çocuk'], isExpanded: true },
    { name: 'Kategori', key: 'category', options: ['Sneaker Ayakkabı', 'Outdoor Ayakkabı', 'Bot&Çizme', 'Terlik&Sandalet', 'Babet'], isExpanded: true },
    { name: 'Beden', key: 'size', options: ['35', '36', '37', '38', '39', '40', '41', '42', '44'], isExpanded: false },
    { name: 'Renk', key: 'color', options: ['Siyah', 'Kemik', 'Krem', 'Pembe', 'Lila', 'Kahve', 'Yeşil', 'Sarı', 'Mavi', 'Beyaz', 'Gri', 'Kırmızı', 'Lacivert', 'Bordo'], isExpanded: false },
    { name: 'Fiyat', key: 'price', options: ['0 - 2500 TL', '2.500 - 5.500 TL', '+ 5.500 TL'], isExpanded: false }
  ]);

  // Sort Menu
  isSortOpen = signal(false);
  sortOptions = [
    { label: 'Önerilenler', value: 'recommended' },
    { label: 'Artan Fiyat', value: 'price_asc' },
    { label: 'Azalan Fiyat', value: 'price_desc' },
    { label: 'Yeni Gelenler', value: 'newest' },
    { label: 'Çok Satanlar', value: 'bestsellers' }
  ];
  selectedSort = signal(this.sortOptions[0]);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const brand = params['brand'];
      this.brandName.set(brand);
      this.breadcrumbItems.set(['Anasayfa', 'Markalar', brand]);
      this.loadProducts(brand);
    });

    if (this.isFilterVisible()) {
      document.body.style.overflow = 'hidden';
    }
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

  onFilterToggle(groupName: string, option: string): void {
    const current = this.selectedFilters();
    const index = current.findIndex(f => f.group === groupName && f.option === option);

    if (index === -1) {
      this.selectedFilters.set([...current, { group: groupName, option: option }]);
    } else {
      this.selectedFilters.set(current.filter((_, i) => i !== index));
    }
  }

  removeFilter(filter: { group: string, option: string }): void {
    const current = this.selectedFilters();
    this.selectedFilters.set(current.filter(f => !(f.group === filter.group && f.option === filter.option)));
  }

  clearFilters(): void {
    this.selectedFilters.set([]);
  }

  isSelected(groupName: string, option: string): boolean {
    return this.selectedFilters().some(f => f.group === groupName && f.option === option);
  }

  toggleFilter(): void {
    this.isFilterVisible.set(!this.isFilterVisible());
    if (this.isFilterVisible()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  toggleFilterGroup(group: FilterGroup): void {
    const updated = this.filterGroups().map(g =>
      g.key === group.key ? { ...g, isExpanded: !g.isExpanded } : g
    );
    this.filterGroups.set(updated);
  }

  setQuickAddProduct(productId: number | null): void {
    this.quickAddProductId.set(productId);
  }

  addToCart(product: Product, size: string | number): void {
    console.log(`Sepete eklendi: ${product.name} - Beden: ${size}`);
    this.quickAddProductId.set(null);
  }

  @HostListener('window:click')
  closeSort(): void {
    this.isSortOpen.set(false);
  }

  toggleSort(): void {
    this.isSortOpen.set(!this.isSortOpen());
  }

  selectSort(option: any): void {
    this.selectedSort.set(option);
    this.isSortOpen.set(false);
  }

  getColorHex(color: string): string {
    const colors: { [key: string]: string } = {
      'Siyah': '#000000',
      'Kemik': '#F9F6EE',
      'Krem': '#FFF9E0',
      'Pembe': '#F8B4E5',
      'Lila': '#B392D4',
      'Kahve': '#8B5A2B',
      'Yeşil': '#769E49',
      'Sarı': '#FFEC33',
      'Mavi': '#4A90E2',
      'Beyaz': '#FFFFFF',
      'Gri': '#B0B0B0',
      'Kırmızı': '#D0021B',
      'Lacivert': '#000080',
      'Bordo': '#800000'
    };
    return colors[color] || '#ccc';
  }
}