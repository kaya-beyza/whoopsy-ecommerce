import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card';

interface FilterOption {
  label: string;
  value: any;
  isExpanded?: boolean;
  subOptions?: FilterOption[];
}

interface FilterGroup {
  name: string;
  key: string;
  isExpanded: boolean;
  options: FilterOption[];
}

@Component({
  selector: 'app-product-list-with-brand',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div class="shop-container">
      <!-- Breadcrumb -->
      <div class="breadcrumb-container">
        <a routerLink="/">ANA SAYFA</a> / <a routerLink="/urunler">ÜRÜNLER</a> / <span class="active">{{ brandName() | uppercase }}</span>
      </div>

      <!-- Header -->
      <header class="shop-header">
        <h1 class="category-name">{{ brandName() }} KOLEKSİYONU</h1>
      </header>

      <!-- Controls Bar -->
      <div class="controls-bar">
        <div class="left-controls">
          <button class="filter-toggle-btn" (click)="toggleSidebar()">
            <span class="material-symbols-sharp">tune</span>
            FİLTRELE {{ isSidebarVisible() ? 'KAPAT' : 'AÇ' }}
          </button>
          <div class="v-divider"></div>
          <span class="product-count">{{ totalCount() }} ÜRÜN</span>
        </div>

        <div class="active-filters" *ngIf="hasAnyFilter()">
          <div class="filter-chip" *ngFor="let filter of selectedFilters()">
            {{ filter.option }}
            <button class="remove-chip" (click)="removeFilter(filter)">
              <span class="material-symbols-sharp">close</span>
            </button>
          </div>
          <div class="filter-chip" *ngIf="isPriceActive()">
            Fiyat: {{ priceChipLabel() }}
            <button class="remove-chip" (click)="clearPriceFilter()">
              <span class="material-symbols-sharp">close</span>
            </button>
          </div>
          <button class="clear-all-link" (click)="clearAllFilters()">TÜMÜNÜ TEMİZLE</button>
        </div>

        <div class="right-controls">
          <div class="custom-sort" [class.open]="isSortOpen()">
            <div class="sort-trigger" (click)="toggleSort()">
              <span class="sort-label">SIRALA:</span>
              <span class="selected-value">{{ currentSortLabel() }}</span>
              <span class="material-symbols-sharp sort-icon">expand_more</span>
            </div>
            <ul class="sort-dropdown" *ngIf="isSortOpen()">
              <li (click)="applySort('recommended', 'Önerilen')">Önerilen</li>
              <li (click)="applySort('newest', 'En Yeniler')">En Yeniler</li>
              <li (click)="applySort('price-asc', 'Fiyat: Düşükten Yükseğe')">Fiyat: Düşükten Yükseğe</li>
              <li (click)="applySort('price-desc', 'Fiyat: Yüksekten Düşüğe')">Fiyat: Yüksekten Düşüğe</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="products-layout" [class.sidebar-hidden]="!isSidebarVisible()">
        <!-- Filter Sidebar -->
        <aside class="filter-sidebar">
          <div class="filter-group" *ngFor="let group of filterGroups()">
            <div class="group-header" (click)="toggleFilterGroup(group)">
              <span>{{ group.name }}</span>
              <span class="material-symbols-sharp">{{ group.isExpanded ? 'remove' : 'add' }}</span>
            </div>
            <div class="group-options" [class.expanded]="group.isExpanded">
              <!-- Special UI for Price Range -->
              <div class="price-range-box" *ngIf="group.key === 'price'; else standardOptions">
                <div class="price-presets">
                  <button type="button" class="price-preset-chip"
                    *ngFor="let preset of pricePresets"
                    [class.active]="isPresetActive(preset)"
                    (click)="selectPricePreset(preset)">
                    {{ preset.label }}
                  </button>
                </div>
                <div class="price-divider"><span>VEYA</span></div>
                <div class="price-inputs">
                  <input type="number" min="0" placeholder="Min ₺"
                    [value]="minPrice() ?? ''"
                    (input)="minPrice.set($any($event.target).valueAsNumber || null)" />
                  <span class="dash">—</span>
                  <input type="number" min="0" placeholder="Max ₺"
                    [value]="maxPrice() ?? ''"
                    (input)="maxPrice.set($any($event.target).valueAsNumber || null)" />
                </div>
                <button class="price-apply-btn" (click)="applyPriceRange()">UYGULA</button>
                <button class="price-clear-link" *ngIf="isPriceActive()" (click)="clearPriceFilter()">FİYAT FİLTRESİNİ TEMİZLE</button>
              </div>

              <!-- Standard Checkbox Options -->
              <ng-template #standardOptions>
                <div class="standard-options">
                  <ng-container *ngIf="group.key !== 'sub-category' || (group.key === 'sub-category' && group.options.length > 0)">
                    <div class="option-row" *ngFor="let opt of group.options">
                      <label class="option-item" [class.active]="isSelected(group.name, opt.label)">
                        <input type="checkbox" [checked]="isSelected(group.name, opt.label)"
                          (change)="onFilterToggle(group.name, opt)">
                        <span class="custom-checkbox"></span>
                        <span class="option-text">{{ opt.label }}</span>
                      </label>
                    </div>
                  </ng-container>
                  <div class="empty-sub-message" *ngIf="group.key === 'sub-category' && group.options.length === 0">
                    <span class="info-text">Lütfen önce bir ana kategori seçiniz.</span>
                  </div>
                </div>
              </ng-template>
            </div>
          </div>
        </aside>

        <!-- Products Grid Area -->
        <section class="products-grid-area">
          <div class="products-grid">
            @for (product of products(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
          
          <div class="load-more-container" *ngIf="hasMore()">
            <button class="load-more-btn" (click)="loadMore()">DAHA FAZLA GÖSTER</button>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .shop-container {
        max-width: 1440px;
        margin: 0 auto;
        padding: 20px 4%;
        background: #ffffff;
        color: #000000;
        font-family: 'Outfit', 'Inter', sans-serif;

        .breadcrumb-container {
            font-size: 11px;
            color: #888;
            margin-bottom: 30px;
            letter-spacing: 1px;
            text-transform: uppercase;
            a { color: inherit; text-decoration: none; &:hover { color: #000; } }
            .active { color: #000; font-weight: 700; }
        }

        .shop-header {
            text-align: center;
            margin-bottom: 50px;
            .category-name {
                font-size: 42px;
                font-weight: 800;
                color: #000;
                letter-spacing: -1px;
                text-transform: uppercase;
            }
        }

        .controls-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            padding: 20px 0;
            margin-bottom: 40px;
            position: sticky;
            top: 0;
            background: #fff;
            z-index: 100;

            .left-controls {
                display: flex;
                align-items: center;
                gap: 30px;
                .filter-toggle-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 13px;
                    text-transform: uppercase;
                    transition: transform 0.2s;
                    &:hover { transform: translateX(5px); }
                }
                .v-divider { width: 1px; height: 15px; background: #ddd; }
                .product-count { font-size: 13px; font-weight: 700; color: #888; }
            }

            .active-filters {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 0 30px;
                .filter-chip {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: #000;
                    color: #fff;
                    padding: 4px 12px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    .remove-chip { background: transparent; border: none; color: #fff; cursor: pointer; padding: 0; }
                }
                .clear-all-link { background: transparent; border: none; font-size: 11px; font-weight: 700; text-decoration: underline; cursor: pointer; text-transform: uppercase; }
            }

            .right-controls {
                .custom-sort {
                    position: relative;
                    .sort-trigger { display: flex; align-items: center; gap: 8px; cursor: pointer; .sort-label { font-size: 14px; color: #888; } .selected-value { font-weight: 700; font-size: 14px; color: #000; } }
                    .sort-dropdown { position: absolute; top: calc(100% + 15px); right: 0; min-width: 180px; background: #fff; border: 1px solid #f0f0f0; box-shadow: 0 10px 30px rgba(0,0,0,0.08); z-index: 100; list-style: none; padding: 8px 0; li { padding: 10px 20px; font-size: 13px; color: #666; cursor: pointer; &:hover { background: #f9f9f9; color: #000; } } }
                }
            }
        }

        .products-layout {
            display: flex;
            gap: 60px;
            &.sidebar-hidden .filter-sidebar { width: 0; opacity: 0; pointer-events: none; }
            .filter-sidebar {
                width: 240px;
                flex-shrink: 0;
                transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                .filter-group {
                    border-bottom: 1px solid #eee;
                    margin-bottom: 5px;
                    .group-header { padding: 20px 0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-weight: 800; font-size: 15px; color: #000; text-transform: uppercase; }
                    .group-options {
                        max-height: 0;
                        overflow: hidden;
                        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

                        &.expanded {
                            max-height: 1000px;
                            padding-bottom: 25px;
                        }

                    .option-row { margin-bottom: 12px; }
                    .option-item {
                        display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 14px; color: #222; font-weight: 500; transition: all 0.2s;
                        &:hover { color: #000; transform: translateX(3px); }
                        input { display: none; }
                        .custom-checkbox { width: 18px; height: 18px; border: 2px solid #888; position: relative; &::after { content: ''; position: absolute; top: 3px; left: 3px; width: 8px; height: 8px; background: #000; opacity: 0; } }
                        input:checked + .custom-checkbox { border-color: #000; &::after { opacity: 1; } }
                    }
                    .empty-sub-message { padding: 10px 0; .info-text { font-size: 12px; color: #aaa; font-style: italic; } }
                        .price-range-box {
                          display: flex; flex-direction: column; gap: 12px; padding-top: 5px;
                          .price-presets { display: flex; flex-direction: column; gap: 8px;
                            .price-preset-chip { background: #fff; color: #222; border: 1px solid #ddd; padding: 10px 12px; font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; text-align: left; transition: all 0.2s;
                              &:hover { border-color: #000; color: #000; }
                              &.active { background: #000; color: #fff; border-color: #000; }
                            }
                          }
                          .price-divider { display: flex; align-items: center; gap: 10px; color: #aaa; font-size: 10px; font-weight: 700; letter-spacing: 1px; margin: 4px 0;
                            &::before, &::after { content: ''; flex: 1; height: 1px; background: #eee; }
                          }
                          .price-inputs { display: flex; align-items: center; gap: 8px;
                            input { width: 100%; padding: 10px 12px; border: 1px solid #ddd; font-size: 13px; font-family: inherit; outline: none; transition: border-color 0.2s;
                              &:focus { border-color: #000; }
                              &::-webkit-outer-spin-button, &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                              &[type=number] { -moz-appearance: textfield; }
                            }
                            .dash { color: #888; font-weight: 600; }
                          }
                          .price-apply-btn { background: #000; color: #fff; border: none; padding: 10px; font-weight: 700; font-size: 12px; letter-spacing: 1px; cursor: pointer; transition: background 0.2s;
                            &:hover { background: #333; }
                          }
                          .price-clear-link { background: transparent; border: 1px solid #000; color: #000; font-size: 12px; font-weight: 700; letter-spacing: 1px; cursor: pointer; padding: 9px 10px; font-family: inherit; transition: all 0.2s; text-transform: uppercase;
                            &:hover { background: #000; color: #fff; }
                          }
                        }
                    }
                }
            }
            .products-grid-area {
                flex: 1;
                .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 50px 30px; }
                .product-card {
                    cursor: pointer;
                    .card-image-wrapper { aspect-ratio: 1/1.25; background: #fdfdfd; position: relative; overflow: hidden; img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.6s; } .wishlist-btn { position: absolute; top: 15px; right: 15px; background: #fff; border: none; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } }
                    &:hover img { transform: scale(1.05); }
                    .card-info { padding: 15px 0; .brand-name { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; } .product-title { font-size: 14px; font-weight: 600; margin: 5px 0; } .current-price { font-weight: 700; font-size: 15px; } }
                }
            }
        }
        .load-more-container { display: flex; justify-content: center; margin: 80px 0; .load-more-btn { background: #000; color: #fff; border: none; padding: 18px 50px; font-weight: 800; cursor: pointer; transition: all 0.3s; &:hover { background: #333; letter-spacing: 2px; } } }
    }
  `]
})
export class ProductListWithBrandComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  brandName = signal<string>('');
  products = signal<Product[]>([]);
  selectedFilters = signal<{ group: string, option: string, value: any }[]>([]);

  filterGroups = signal<FilterGroup[]>([
    {
      name: 'Cinsiyet', key: 'gender', isExpanded: true, options: [
        { label: 'Kadın', value: 2 },
        { label: 'Erkek', value: 1 },
        { label: 'Çocuk', value: 3 },
        { label: 'Unisex', value: 0 }
      ]
    },
    {
      name: 'Ana Kategori', key: 'main-category', isExpanded: true,
      options: []
    },
    { name: 'Alt Kategori', key: 'sub-category', isExpanded: true, options: [] },
    {
      name: 'Marka', key: 'brand', isExpanded: true, options: [
        { label: 'Adidas', value: 'Adidas' },
        { label: 'Converse', value: 'Converse' },
        { label: 'New Balance', value: 'NewBalance' },
        { label: 'Nike', value: 'Nike' },
        { label: 'Puma', value: 'Puma' },
        { label: 'Vans', value: 'Vans' }
      ]
    },
    {
      name: 'Fiyat', key: 'price', isExpanded: false, options: []
    }
  ]);

  isSidebarVisible = signal(true);
  isSortOpen = signal(false);
  currentSortLabel = signal('Önerilen');
  hasMore = signal(false);
  isLoading = signal(false);
  isMoreLoading = signal(false);
  totalCount = signal(0);
  currentPage = signal(1);
  pageSize = 21;

  private categoryTree: FilterOption[] = [];

  // Fiyat aralığı (custom min/max input — backend'e gönderiliyor)
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);

  // Hazır fiyat aralıkları (preset chip'leri)
  pricePresets = [
    { label: '0 - 2.500 ₺', min: 0, max: 2500 },
    { label: '2.500 - 5.500 ₺', min: 2500, max: 5500 },
    { label: '+ 5.500 ₺', min: 5500, max: null }
  ];

  selectPricePreset(preset: { min: number | null, max: number | null }): void {
    this.minPrice.set(preset.min);
    this.maxPrice.set(preset.max);
    this.loadProducts(this.brandName());
  }

  isPresetActive(preset: { min: number | null, max: number | null }): boolean {
    return this.minPrice() === preset.min && this.maxPrice() === preset.max;
  }

  applyPriceRange(): void {
    this.loadProducts(this.brandName());
  }

  isPriceActive(): boolean {
    return this.minPrice() != null || this.maxPrice() != null;
  }

  hasAnyFilter(): boolean {
    return this.selectedFilters().length > 0 || this.isPriceActive();
  }

  priceChipLabel(): string {
    const min = this.minPrice();
    const max = this.maxPrice();
    if (min != null && max != null) return `${min} - ${max} ₺`;
    if (min != null) return `+ ${min} ₺`;
    if (max != null) return `Max ${max} ₺`;
    return '';
  }

  clearPriceFilter(): void {
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.loadProducts(this.brandName());
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.brandName.set(params['brand']);
      this.loadCategories();
      this.loadProducts(params['brand']);
    });
  }

  loadCategories(): void {
    this.productService.getCategoryTree().subscribe({
      next: (categories) => {
        const order = ['Ayakkabı', 'Giyim', 'Aksesuar', 'Diğer'];
        this.categoryTree = categories
          .filter(c => order.includes(c.name || c.Name))
          .sort((a, b) => order.indexOf(a.name || a.Name) - order.indexOf(b.name || b.Name))
          .map(c => ({
            label: c.name || c.Name,
            value: c.id || c.Id,
            isExpanded: false,
            subOptions: (c.subCategories || c.SubCategories)?.map((sub: any) => ({
              label: sub.name || sub.Name,
              value: sub.id || sub.Id
            })) || []
          }));

        this.filterGroups.update(groups => groups.map(g =>
          g.key === 'main-category' ? { ...g, options: this.categoryTree } : g
        ));
        this.updateSubCategories();
      }
    });
  }

  loadProducts(brand: string): void {
    this.isLoading.set(true);
    this.currentPage.set(1);
    const filters = this.selectedFilters();
    const genders = filters.filter(f => f.group === 'Cinsiyet').map(f => f.value as number);
    const categoryIds = filters.filter(f => f.group === 'Alt Kategori' || f.group === 'Ana Kategori').map(f => f.value.toString());

    this.productService.getProductsByFilter(
      genders.length > 0 ? genders : undefined,
      [brand.replace(/\s/g, '')],
      categoryIds,
      undefined,
      this.minPrice(),
      this.maxPrice(),
      1,
      this.pageSize
    ).subscribe({
      next: (res) => {
        this.products.set(res.items);
        this.totalCount.set(res.totalCount);
        this.hasMore.set(res.totalCount > this.products().length);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onFilterToggle(groupName: string, option: FilterOption): void {
    const current = this.selectedFilters();
    const index = current.findIndex(f => f.group === groupName && f.option === option.label);

    if (index === -1) {
      if (groupName === 'Ana Kategori') {
        this.selectedFilters.set([...current.filter(f => f.group !== 'Ana Kategori' && f.group !== 'Alt Kategori'), { group: groupName, option: option.label, value: option.value }]);
      } else {
        this.selectedFilters.set([...current, { group: groupName, option: option.label, value: option.value }]);
      }
    } else {
      this.selectedFilters.set(current.filter((_, i) => i !== index));
    }

    if (groupName === 'Ana Kategori') {
      this.updateSubCategories();
    }
    this.loadProducts(this.brandName());
  }

  updateSubCategories(): void {
    const selectedMain = this.selectedFilters().find(f => f.group === 'Ana Kategori');
    let subOptions: FilterOption[] = [];

    if (selectedMain) {
      const parent = this.categoryTree.find(c => c.label === selectedMain.option);
      if (parent) subOptions = parent.subOptions || [];
    }

    this.filterGroups.update(groups => groups.map(g =>
      g.key === 'sub-category' ? { ...g, options: subOptions } : g
    ));
  }

  isSelected(groupName: string, optionLabel: string): boolean {
    return this.selectedFilters().some(f => f.group === groupName && f.option === optionLabel);
  }

  toggleSidebar(): void { this.isSidebarVisible.update(v => !v); }
  toggleSort(): void { this.isSortOpen.update(v => !v); }
  toggleFilterGroup(group: FilterGroup): void { group.isExpanded = !group.isExpanded; }

  applySort(id: string, label: string): void {
    this.currentSortLabel.set(label);
    this.isSortOpen.set(false);
  }

  removeFilter(filter: any): void {
    this.selectedFilters.update(current => current.filter(f => !(f.group === filter.group && f.option === filter.option)));
    if (filter.group === 'Ana Kategori') {
      this.updateSubCategories();
    }
    this.loadProducts(this.brandName());
  }

  clearAllFilters(): void {
    this.selectedFilters.set([]);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.updateSubCategories();
    this.loadProducts(this.brandName());
  }

  loadMore(): void {
    if (this.isMoreLoading() || !this.hasMore()) return;

    this.isMoreLoading.set(true);
    const nextPage = this.currentPage() + 1;
    const brand = this.brandName();
    const filters = this.selectedFilters();
    const genders = filters.filter(f => f.group === 'Cinsiyet').map(f => f.value as number);
    const categoryIds = filters.filter(f => f.group === 'Alt Kategori' || f.group === 'Ana Kategori').map(f => f.value.toString());

    this.productService.getProductsByFilter(
      genders.length > 0 ? genders : undefined,
      [brand.replace(/\s/g, '')],
      categoryIds,
      undefined,
      this.minPrice(),
      this.maxPrice(),
      nextPage,
      this.pageSize
    ).subscribe({
      next: (res) => {
        if (res.items.length > 0) {
          this.products.update(prev => [...prev, ...res.items]);
          this.totalCount.set(res.totalCount);
          this.currentPage.set(nextPage);
          this.hasMore.set(res.totalCount > this.products().length);
        } else {
          this.hasMore.set(false);
        }
        this.isMoreLoading.set(false);
      },
      error: () => this.isMoreLoading.set(false)
    });
  }

}