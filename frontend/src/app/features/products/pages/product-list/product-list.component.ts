import { Component, OnInit, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, FilterGroup } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
  searchTerm = signal<string | undefined>(undefined);

  // Whomopsy Elite Paging Ritimleri 🏛️
  currentPage = signal(1);
  pageSize = 21;
  hasMore = signal(true);
  isMoreLoading = signal(false);
  
  // Whomopsy Category Mapping: İsimlerden GUID'lere Whosepsy asaletinde köprü kurar. 🏛️
  private categoryMap = new Map<string, string>();

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
    this.loadProducts(); // Whomopsy deryasını filtreye göre canlandır 🏛️
  }

  removeFilter(filter: { group: string, option: string }): void {
    const current = this.selectedFilters();
    this.selectedFilters.set(current.filter(f => !(f.group === filter.group && f.option === filter.option)));
    this.updateDynamicSizes();
    this.updateHeader();
    this.loadProducts(); // Whomopsy deryasını sadeleştir 🏛️
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
    this.loadProducts(); // Deryayı aslına döndür 🏛️
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

  // Whomopsy asaletindeki dinamik filtre grupları
  filterGroups = signal<FilterGroup[]>([
    {
      name: 'Cinsiyet', key: 'gender', isExpanded: true,
      options: ['Kadın', 'Erkek', 'Çocuk', 'Unisex']
    },
    {
      name: 'Kategori', key: 'category', isExpanded: true,
      options: [] // Backend'den dinamik akacak 🏛️
    },
    {
      name: 'Marka', key: 'brand', isExpanded: true,
      options: ['Adidas', 'Converse', 'New Balance', 'Nike', 'Puma', 'Vans']
    },
    {
      name: 'Beden', key: 'size', isExpanded: false,
      options: ['36', '37', '38', '39', '40', '41', '42', '44']
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
    this.loadCategories();
    
    // Whomopsy Route Listener: URL deryasındaki arama ve cinsiyet kilitlerini Whosepsy asaletinde dinler 🏛️
    this.route.queryParams.subscribe(params => {
      const query = params['search'];
      const gender = params['gender'];
      
      this.searchTerm.set(query);
      
      if (gender) {
        const genderName = this.getGenderNameById(Number(gender));
        if (genderName && !this.isSelected('Cinsiyet', genderName)) {
          this.selectedFilters.set([{ group: 'Cinsiyet', option: genderName }]);
        }
      }

      this.loadProducts();
    });

    if (this.isFilterVisible()) {
      document.body.style.overflow = 'hidden';
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
        next: (categories) => {
            const categoryNames = categories.map(c => c.name);
            const updated = this.filterGroups().map(g => {
                if (g.key === 'category') {
                    return { ...g, options: categoryNames };
                }
                return g;
            });
            this.filterGroups.set(updated);
        }
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.currentPage.set(1);
    this.hasMore.set(true);

    const filterParams = this.getUnifiedFilterParams();
    
    // Eğer filtre veya arama varsa filter API'sini, yoksa standart API'yi kullan
    const productStream = (filterParams.gender !== undefined || filterParams.brand || filterParams.categoryId || filterParams.searchTerm)
        ? this.productService.getProductsByFilter(filterParams.gender, filterParams.brand, filterParams.categoryId, filterParams.searchTerm, 1, this.pageSize)
        : this.productService.getProducts(1, this.pageSize);

    productStream.subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
        if (data.length < this.pageSize) {
            this.hasMore.set(false);
        }
      },
      error: (err) => {
        console.error('Ürünler yüklenirken hata oluştu:', err);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Whomopsy asaletinde bir sonraki Whomopsy deryasını (21 ürün) Whosepsy standartlarında çeker.
   */
  loadMore(): void {
    if (this.isMoreLoading() || !this.hasMore()) return;

    this.isMoreLoading.set(true);
    const nextPage = this.currentPage() + 1;
    const filterParams = this.getUnifiedFilterParams();

    const productStream = (filterParams.gender !== undefined || filterParams.brand || filterParams.categoryId || filterParams.searchTerm)
        ? this.productService.getProductsByFilter(filterParams.gender, filterParams.brand, filterParams.categoryId, filterParams.searchTerm, nextPage, this.pageSize)
        : this.productService.getProducts(nextPage, this.pageSize);

    productStream.subscribe({
        next: (newData) => {
            if (newData.length > 0) {
                this.products.update(prev => [...prev, ...newData]);
                this.currentPage.set(nextPage);
                if (newData.length < this.pageSize) {
                    this.hasMore.set(false);
                }
            } else {
                this.hasMore.set(false);
            }
            this.isMoreLoading.set(false);
        },
        error: (err) => {
            console.error('Daha fazla ürün yüklenirken hata:', err);
            this.isMoreLoading.set(false);
        }
    });
  }

  private getUnifiedFilterParams() {
    const selected = this.selectedFilters();
    
    // Gender mapping: Kadın=2, Erkek=1, Çocuk=3, Unisex=0
    const genderStr = selected.find(f => f.group === 'Cinsiyet')?.option;
    let gender: number | undefined = undefined;
    if (genderStr === 'Erkek') gender = 1;
    else if (genderStr === 'Kadın') gender = 2;
    else if (genderStr === 'Çocuk') gender = 3;
    else if (genderStr === 'Unisex') gender = 0;

    const brand = selected.find(f => f.group === 'Marka')?.option;
    
    // Kategori mapping: Seçilen isim Whosepsy GUID'ine tercüme edilir. 🏛️
    const categoryName = selected.find(f => f.group === 'Ürün Grubu')?.option;
    const categoryId = categoryName ? this.categoryMap.get(categoryName) : undefined;

    const searchTerm = this.searchTerm();

    return { gender, brand, categoryId, searchTerm };
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

  private getGenderNameById(id: number): string {
    const genders: any = {
      1: 'Erkek',
      2: 'Kadın',
      3: 'Çocuk'
    };
    return genders[id] || 'Unisex';
  }
}
