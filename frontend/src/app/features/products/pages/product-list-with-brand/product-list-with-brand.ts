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
      max-width: 1440px;
      margin: 0 auto;
      padding: 20px 4%;
      background: #ffffff;
      color: #000000;
      font-family: var(--font-body);
    }

    .breadcrumb-container {
        font-size: 11px;
        color: #888;
        margin-bottom: 30px;
        letter-spacing: 0.5px;

        span {
            &.active {
                color: #000;
                font-weight: 700;
            }
        }
    }

    .shop-header {
      text-align: center;
      margin-bottom: 40px;

      .category-name {
        font-family: var(--font-nav);
        font-size: 32px;
        font-weight: 700;
        color: #000;
        letter-spacing: 1px;
      }
    }

    .controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #f2f2f2;
      border-bottom: 1px solid #f2f2f2;
      padding: 15px 0;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;

      .left-controls {
        display: flex;
        align-items: center;
        gap: 20px;
        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 14px;
          color: #555;
          transition: color 0.2s;
          .material-symbols-sharp { font-size: 20px !important; }
          &:hover { color: #000; }
        }
        .v-divider { width: 1px; height: 20px; background: #eee; }
        .product-count { font-size: 13px; font-weight: 600; color: #000; }
      }

      .active-filters {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        padding: 0 40px;

        .filter-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f7f7f7;
          padding: 6px 14px;
          border-radius: 4px;
          font-size: 12px;
          .chip-label { color: #888; }
          .chip-value { color: #000; font-weight: 600; }
          .remove-chip {
            background: transparent;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            color: #aaa;
            transition: color 0.2s;
            &:hover { color: #000; }
            .material-symbols-sharp { font-size: 14px !important; }
          }
        }
        .clear-all-link {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          text-decoration: underline;
          color: #000;
          padding: 6px 0;
        }
      }

      .right-controls {
        .custom-sort {
          position: relative;
          user-select: none;
          .sort-trigger {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            .sort-label { font-size: 14px; color: #888; }
            .selected-value { font-weight: 700; font-size: 14px; color: #000; }
            .sort-icon { font-size: 18px !important; transition: transform 0.3s; }
          }
          &.open .sort-icon { transform: rotate(180deg); }
          .sort-dropdown {
            position: absolute;
            top: calc(100% + 15px);
            right: 0;
            min-width: 180px;
            background: #fff;
            border: 1px solid #f0f0f0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            z-index: 100;
            list-style: none;
            padding: 8px 0;
            li {
              padding: 10px 20px;
              font-size: 13px;
              color: #666;
              cursor: pointer;
              transition: all 0.2s;
              &:hover { background: #f9f9f9; color: #000; }
              &.active { color: #000; font-weight: 700; }
            }
          }
        }
      }
    }

    .products-layout {
      display: flex;
      gap: 40px;
      position: relative;
      min-height: 800px;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

      &.sidebar-hidden {
          .filter-sidebar {
              width: 0;
              opacity: 0;
              margin-right: -40px;
              pointer-events: none;
          }
      }

      .filter-sidebar {
        width: 250px;
        flex-shrink: 0;
        border-right: 1px solid #f2f2f2;
        transition: inherit;
        overflow-y: auto;
        max-height: calc(100vh - 200px);
        position: sticky;
        top: 100px;

        &::-webkit-scrollbar { width: 4px; }
        &::-webkit-scrollbar-track { background: transparent; }
        &::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
        &:hover::-webkit-scrollbar-thumb { background: #ddd; }

        .filter-content {
          padding-right: 20px;
          .filter-group {
            border-bottom: 1px solid #f2f2f2;
            &:last-child { border: none; }
            .group-header {
              padding: 20px 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: pointer;
              font-weight: 700;
              font-size: 15px;
              color: #000;
              .material-symbols-sharp { font-size: 20px; color: #888; }
            }
            .group-options {
              max-height: 0;
              overflow: hidden;
              transition: 0.3s ease-out;
              &.expanded {
                  max-height: 2000px;
                  padding-bottom: 30px;
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
              }
              .color-swatch-grid {
                  display: grid;
                  grid-template-columns: repeat(6, 1fr);
                  gap: 10px;
                  padding: 0 5px 10px;
                  .swatch-item {
                      width: 28px;
                      height: 28px;
                      border-radius: 50%;
                      border: none;
                      cursor: pointer;
                      position: relative;
                      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                      &.light { border: 1px solid #f0f0f0; }
                      &:hover { transform: scale(1.15); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                      &.active { box-shadow: 0 0 0 2px #fff, 0 0 0 4px #000; transform: scale(0.9); }
                  }
              }
              .option-item {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 14px;
                color: #555;
                cursor: pointer;
                &:hover { color: #000; }
                
                input[type="checkbox"] {
                    display: none;
                    &:checked+.custom-checkbox {
                        background: #000;
                        border-color: #000;
                        position: relative;
                        &::after {
                            content: "";
                            position: absolute;
                            top: 50%; left: 50%;
                            transform: translate(-50%, -50%);
                            width: 8px; height: 8px;
                            background: #fff;
                            border-radius: 1px;
                        }
                    }
                }
                .custom-checkbox {
                    width: 20px; height: 20px;
                    border: 1.5px solid #000;
                    border-radius: 0;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    flex-shrink: 0;
                }
              }
            }
          }
        }
      }

      .products-grid-area {
        flex: 1;
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 40px;
        }
      }
    }

    .product-card {
        .card-image-wrapper {
            position: relative;
            aspect-ratio: 1 / 1.25;
            background: #f9f9f9;
            overflow: hidden;
            img {
                width: 100%; height: 100%;
                object-fit: cover;
                transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .badge {
                position: absolute; top: 15px; left: 15px;
                font-size: 9px; font-weight: 800; padding: 5px 10px;
                border-radius: 2px; letter-spacing: 1px; z-index: 10;
            }
            .bestseller { background: #000; color: #fff; }
            .new { background: #fff; color: #000; border: 1px solid #eee; }
            .discount { background: #ff3b30; color: #fff; }

            .wishlist-btn {
                position: absolute; top: 15px; right: 15px;
                background: #fff; border: none; width: 34px; height: 34px;
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                z-index: 5; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            }
            .quick-plus-trigger {
                position: absolute; bottom: 15px; right: 15px;
                width: 34px; height: 34px; background: #fff; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                z-index: 5; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            }
        }
        &:hover img { transform: scale(1.05); }
        .card-info {
            padding: 15px 0;
            .brand-name { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #888; margin-bottom: 5px; }
            .product-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #000; }
            .price-row {
                .current-price { font-weight: 700; font-size: 15px; &.discounted { color: #e8000d; } }
                .original-price { font-size: 13px; color: #999; text-decoration: line-through; margin-right: 10px; }
            }
        }
    }

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
    {
      name: 'Ürün Grubu', key: 'group', isExpanded: true,
      options: ['Ayakkabı', 'Giyim', 'Aksesuar']
    },
    {
      name: 'Cinsiyet', key: 'gender', isExpanded: true,
      options: ['Kadın', 'Erkek', 'Çocuk']
    },
    {
      name: 'Kategori', key: 'category', isExpanded: true,
      options: [
        'Anahtarlık', 'Atkı', 'Bağcık', 'Bel Çantası', 'Bere', 'Bot', 'Bot & Çizme',
        'Ceket', 'Çanta', 'Çorap', 'Eşofman Altı', 'Etek', 'Hoodie', 'Mont',
        'Omuz Çantası', 'Pantolon', 'Rozet', 'Rüzgarlık', 'Sandalet',
        'Sırt Çantası', 'Sneaker', 'Sweatshirt', 'Şapka', 'Tayt',
        'Terlik', 'T-Shirt'
      ]
    },
    {
      name: 'Marka', key: 'brand', isExpanded: true,
      options: ['adidas', 'Converse', 'New Balance', 'Nike', 'Puma', 'Vans']
    },
    {
      name: 'Beden', key: 'size', isExpanded: false,
      options: ['35', '36', '37', '38', '39', '40', '41', '42', '44']
    },
    {
      name: 'Renk', key: 'color', isExpanded: false,
      options: ['Siyah', 'Beyaz', 'Mavi', 'Kırmızı', 'Yeşil', 'Gri', 'Kemik', 'Krem', 'Pembe', 'Lila', 'Kahve', 'Sarı', 'Lacivert', 'Bordo']
    },
    {
      name: 'Fiyat', key: 'price', isExpanded: false,
      options: ['0 - 2500 TL', '2.500 - 5.500 TL', '+ 5.500 TL']
    }
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
      const formattedBrand = brand.toLowerCase();
      this.brandName.set(brand);
      this.breadcrumbItems.set(['Anasayfa', 'Markalar', brand]);
      
      // Auto-filter logic: Trigger filter for the current brand
      // We look for the exact matching option in the brand group
      this.loadProducts(brand);

      // Add brand to selected filters automatically (Case-insensitive match with available options)
      const currentFilters = this.selectedFilters();
      const brandOption = this.filterGroups().find(g => g.key === 'brand')?.options.find(o => o.toLowerCase() === formattedBrand);
      const finalOption = brandOption || brand;

      if (!currentFilters.some(f => f.group === 'Marka' && f.option === finalOption)) {
          this.selectedFilters.set([...currentFilters, { group: 'Marka', option: finalOption }]);
      }
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
    this.updateDynamicSizeSets();
  }

  onFilterToggle(groupName: string, option: string): void {
    const current = this.selectedFilters();
    const index = current.findIndex(f => f.group === groupName && f.option === option);

    if (index === -1) {
      this.selectedFilters.set([...current, { group: groupName, option: option }]);
    } else {
      this.selectedFilters.set(current.filter((_, i) => i !== index));
    }
    this.updateDynamicSizeSets();
  }

  private readonly sizeSets = {
    shoesAdult: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    shoesChild: ['18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'],
    clothingAdult: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    clothingChild: ['2-3 Yaş', '4-5 Yaş', '6-7 Yaş', '8-9 Yaş', '10-11 Yaş', '12-13 Yaş'],
    accessory: ['Standart'],
    default: ['36', '37', '38', '39', '40', '41', 'XS', 'S', 'M', 'L', 'XL', 'Standart']
  };

  updateDynamicSizeSets(): void {
    const selected = this.selectedFilters();
    const groups = selected.filter(f => f.group === 'Ürün Grubu').map(f => f.option);
    const genders = selected.filter(f => f.group === 'Cinsiyet').map(f => f.option);
    
    const isAdultSelected = genders.some(g => g === 'Kadın' || g === 'Erkek');
    const isChildSelected = genders.some(g => g === 'Çocuk');

    let newSizes: string[] = [];

    if (groups.length === 0) {
      newSizes = this.sizeSets.default;
    } else {
      if (groups.includes('Ayakkabı')) {
        if (!isAdultSelected && !isChildSelected) {
          newSizes.push(...this.sizeSets.shoesAdult);
        } else {
          if (isAdultSelected) newSizes.push(...this.sizeSets.shoesAdult);
          if (isChildSelected) newSizes.push(...this.sizeSets.shoesChild);
        }
      }
      
      if (groups.includes('Giyim')) {
        if (!isAdultSelected && !isChildSelected) {
          newSizes.push(...this.sizeSets.clothingAdult);
        } else {
          if (isAdultSelected) newSizes.push(...this.sizeSets.clothingAdult);
          if (isChildSelected) newSizes.push(...this.sizeSets.clothingChild);
        }
      }
      
      if (groups.includes('Aksesuar')) {
        newSizes.push(...this.sizeSets.accessory);
      }
    }

    const uniqueSizes = [...new Set(newSizes)];
    
    const updated = this.filterGroups().map(g => {
      if (g.key === 'size') {
        return { ...g, options: uniqueSizes };
      }
      return g;
    });
    
    this.filterGroups.set(updated);
  }

  removeFilter(filter: { group: string, option: string }): void {
    const current = this.selectedFilters();
    this.selectedFilters.set(current.filter(f => !(f.group === filter.group && f.option === filter.option)));
    this.updateDynamicSizeSets();
  }

  clearFilters(): void {
    this.selectedFilters.set([]);
    this.updateDynamicSizeSets();
  }

  isSelected(groupName: string, option: string): boolean {
    return this.selectedFilters().some(f => f.group === groupName && f.option.toLowerCase() === option.toLowerCase());
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