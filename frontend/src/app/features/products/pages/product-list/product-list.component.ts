import { Component, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  products = signal<Product[]>([]);
  isLoading = signal(true);
  isFilterVisible = signal(false);
  quickAddProductId = signal<number | null>(null);

  // 🌟 Sıralama Menüsü Durumu
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
    { name: 'Kategori', key: 'category', options: ['Sneaker', 'Yüksek Bilekli', 'Lifestyle', 'Platform'], isExpanded: true },
    { name: 'Marka', key: 'brand', options: ['Nike', 'adidas', 'New Balance', 'Puma', 'Vans', 'Converse'], isExpanded: false },
    { name: 'Beden', key: 'size', options: ['36', '37', '38', '39', '40', '41', '42', '44'], isExpanded: false },
    { name: 'Renk', key: 'color', options: ['Siyah', 'Beyaz', 'Bej', 'Mavi'], isExpanded: false },
    { name: 'Fiyat', key: 'price', options: ['0 - 1000 TL', '1000 - 3000 TL', '3000 TL +'], isExpanded: false }
  ]);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
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

  // 🌟 Sıralama Fonksiyonları
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
    // Burada ileride gerçek sıralama mantığı tetiklenebilir.
    console.log('Sıralama değişti:', option.value);
  }
}
