import { Component, OnInit, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, FilterGroup } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  isLoading = signal(true);
  isFilterVisible = signal(true);
  quickAddProductId = signal<number | null>(null);

  // Dinamik Başlık ve Breadcrumb
  pageTitle = signal('TÜM ÜRÜNLER');
  breadcrumbItems = signal(['Anasayfa', 'Kadın', 'Ayakkabı', 'Tüm Ayakkabılar']);

  // Filtreleme (Grup: Seçenek formatı için)
  selectedFilters = signal<{ group: string, option: string }[]>([]);

  onFilterToggle(groupName: string, option: string): void {
    const current = this.selectedFilters();
    const index = current.findIndex(f => f.group === groupName && f.option === option);

    if (index === -1) {
      this.selectedFilters.set([...current, { group: groupName, option: option }]);
    } else {
      this.selectedFilters.set(current.filter((_, i) => i !== index));
    }

    this.updateHeader();
  }

  removeFilter(filter: { group: string, option: string }): void {
    const current = this.selectedFilters();
    this.selectedFilters.set(current.filter(f => !(f.group === filter.group && f.option === filter.option)));
    this.updateHeader();
  }

  updateHeader(): void {
    const genderFilters = this.selectedFilters().filter(f => f.group === 'Cinsiyet');

    if (genderFilters.length === 1) {
      this.pageTitle.set(genderFilters[0].option.toUpperCase());
    } else if (genderFilters.length > 1) {
      this.pageTitle.set('FİLTRELENMİŞ ÜRÜNLER');
    } else {
      this.pageTitle.set('TÜM ÜRÜNLER');
    }
  }

  clearFilters(): void {
    this.selectedFilters.set([]);
    this.updateHeader();
  }

  isSelected(groupName: string, option: string): boolean {
    return this.selectedFilters().some(f => f.group === groupName && f.option === option);
  }

  // Sıralama Menüsü
  isSortOpen = signal(false);
  sortOptions = [
    { label: 'Önerilenler', value: 'recommended' },
    { label: 'Artan Fiyat', value: 'price_asc' },
    { label: 'Azalan Fiyat', value: 'price_desc' },
    { label: 'Yeni Gelenler', value: 'newest' },
    { label: 'Çok Satanlar', value: 'bestsellers' }
  ];
  selectedSort = signal(this.sortOptions[0]);

  filterGroups = signal<FilterGroup[]>([
    { name: 'Cinsiyet', key: 'gender', options: ['Kadın', 'Erkek', 'Çocuk'], isExpanded: true },
    { name: 'Kategori', key: 'category', options: ['Sneaker Ayakkabı', 'Outdoor Ayakkabı', 'Bot&Çizme', 'Terlik&Sandalet', 'Babet'], isExpanded: true },
    { name: 'Marka', key: 'brand', options: ['adidas', 'Converse', 'New Balance', 'Nike', 'Puma', 'Vans'], isExpanded: false },
    { name: 'Beden', key: 'size', options: ['35', '36', '37', '38', '39', '40', '41', '42', '44'], isExpanded: false },
    { name: 'Renk', key: 'color', options: ['Siyah', 'Kemik', 'Krem', 'Pembe', 'Lila', 'Kahve', 'Yeşil', 'Sarı', 'Mavi', 'Beyaz', 'Gri', 'Kırmızı', 'Lacivert', 'Bordo'], isExpanded: false },
    { name: 'Fiyat', key: 'price', options: ['0 - 2500 TL', '2.500 - 5.500 TL', '+ 5.500 TL'], isExpanded: false }
  ]);

  constructor() { }

  ngOnInit(): void {
    this.loadProducts();
    if (this.isFilterVisible()) {
      document.body.style.overflow = 'hidden';
    }
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Ürünler yüklenirken hata oluştu:', err);
        this.isLoading.set(false);
      }
    });
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

  // Sıralama Fonksiyonları
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
    console.log('Sıralama değişti:', option.value);
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
