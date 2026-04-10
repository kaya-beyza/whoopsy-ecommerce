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

    this.updateDynamicSizes();
    this.updateHeader();
  }

  removeFilter(filter: { group: string, option: string }): void {
    const current = this.selectedFilters();
    this.selectedFilters.set(current.filter(f => !(f.group === filter.group && f.option === filter.option)));
    this.updateDynamicSizes();
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
    this.updateDynamicSizes();
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

  // Akıllı Beden Setleri
  private readonly sizeSets = {
    shoesAdult: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    shoesChild: ['18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'],
    clothingAdult: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    clothingChild: ['2-3 Yaş', '4-5 Yaş', '6-7 Yaş', '8-9 Yaş', '10-11 Yaş', '12-13 Yaş'],
    accessory: ['Standart'],
    default: ['36', '37', '38', '39', '40', '41', 'XS', 'S', 'M', 'L', 'XL', 'Standart']
  };

  updateDynamicSizes(): void {
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
        // Eğer hiçbir cinsiyet seçilmemişse varsayılan olarak yetişkin göster
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

    // Tekrar edenleri temizle ve filterGroups'u güncelle
    const uniqueSizes = [...new Set(newSizes)];
    
    const updated = this.filterGroups().map(g => {
      if (g.key === 'size') {
        return { ...g, options: uniqueSizes };
      }
      return g;
    });
    
    this.filterGroups.set(updated);
  }

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
