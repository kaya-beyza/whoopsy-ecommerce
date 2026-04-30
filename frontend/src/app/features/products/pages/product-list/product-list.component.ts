import { Component, OnInit, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, FilterGroup, FilterOption } from '../../models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
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
  totalCount = signal(0);

  // Pagination state management
  currentPage = signal(1);
  pageSize = 21;
  hasMore = signal(true);
  isMoreLoading = signal(false);
  
  // Category mapping: translates display names to unique GUIDs
  private categoryMap = new Map<string, string>();

  // Dinamik Başlık ve Breadcrumb
  pageTitle = signal('TÜM ÜRÜNLER');
  breadcrumbItems = signal(['Anasayfa', 'Kadın', 'Ayakkabı', 'Tüm Ayakkabılar']);

  // Filtreleme (Grup: Seçenek formatı için)
  selectedFilters = signal<{ group: string, option: string, value: any }[]>([]);

  onFilterToggle(groupName: string, option: FilterOption): void {
    const current = this.selectedFilters();
    const index = current.findIndex(f => f.group === groupName && f.option === option.label);

    if (index === -1) {
      this.selectedFilters.set([...current, { group: groupName, option: option.label, value: option.value }]);
    } else {
      this.selectedFilters.set(current.filter((_, i) => i !== index));
    }

    // Synchronize categories: If a parent category is toggled, update subcategories
    if (groupName === 'Ana Kategori') {
        this.updateSubCategories();
    }

    if (groupName === 'Cinsiyet' || groupName === 'Ana Kategori' || groupName === 'Alt Kategori') {
        this.updateDynamicSizes();
    }
    this.updateHeader();
    this.loadProducts(); 
  }

  removeFilter(filter: { group: string, option: string, value?: any }): void {
    const current = this.selectedFilters();
    this.selectedFilters.set(current.filter(f => !(f.group === filter.group && f.option === filter.option)));
    this.updateDynamicSizes();
    this.updateHeader();
    this.loadProducts(); 
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
    this.loadProducts(); // Reset to default product list
  }

  isSelected(groupName: string, optionLabel: string): boolean {
    return this.selectedFilters().some(f => f.group === groupName && f.option === optionLabel);
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
    const groups = selected.filter(f => f.group === 'Ana Kategori').map(f => f.option);
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
        const sizeOptions: FilterOption[] = uniqueSizes.map(s => ({ label: s, value: s }));
        return { ...g, options: sizeOptions };
      }
      return g;
    });
    
    this.filterGroups.set(updated);
  }

  // Dynamic sidebar filter configuration
  filterGroups = signal<FilterGroup[]>([
    {
      name: 'Cinsiyet', key: 'gender', isExpanded: true,
      options: [
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
    {
      name: 'Alt Kategori', key: 'sub-category', isExpanded: true,
      options: [] 
    },
    {
      name: 'Marka', key: 'brand', isExpanded: true,
      options: [
        { label: 'Adidas', value: 'Adidas' },
        { label: 'Converse', value: 'Converse' },
        { label: 'New Balance', value: 'NewBalance' },
        { label: 'Nike', value: 'Nike' },
        { label: 'Puma', value: 'Puma' },
        { label: 'Vans', value: 'Vans' }
      ]
    },
    {
      name: 'Beden', key: 'size', isExpanded: false,
      options: []
    },
    {
      name: 'Renk', key: 'color', isExpanded: false,
      options: [
        { label: 'Siyah', value: 'Siyah' },
        { label: 'Beyaz', value: 'Beyaz' },
        { label: 'Mavi', value: 'Mavi' },
        { label: 'Kırmızı', value: 'Kırmızı' },
        { label: 'Yeşil', value: 'Yeşil' },
        { label: 'Gri', value: 'Gri' },
        { label: 'Kemik', value: 'Kemik' },
        { label: 'Krem', value: 'Krem' },
        { label: 'Pembe', value: 'Pembe' },
        { label: 'Lila', value: 'Lila' },
        { label: 'Kahve', value: 'Kahve' },
        { label: 'Sarı', value: 'Sarı' },
        { label: 'Lacivert', value: 'Lacivert' },
        { label: 'Bordo', value: 'Bordo' }
      ]
    },
    {
      name: 'Fiyat', key: 'price', isExpanded: false,
      options: [
        { label: '0 - 2500 TL', value: '0-2500' },
        { label: '2.500 - 5.500 TL', value: '2500-5500' },
        { label: '+ 5.500 TL', value: '5500-up' }
      ]
    }
  ]);

  constructor() { }

  ngOnInit(): void {
    this.loadCategories();
    
    // Route Listener: updates state based on search query or gender parameters
    this.route.queryParams.subscribe(params => {
      const query = params['search'];
      const gender = params['gender'];
      
      this.searchTerm.set(query);
      
      if (gender) {
        const genderName = this.getGenderNameById(Number(gender));
        if (genderName && !this.isSelected('Cinsiyet', genderName)) {
          this.selectedFilters.set([{ group: 'Cinsiyet', option: genderName, value: Number(gender) }]);
          this.updateDynamicSizes();
          this.updateHeader();
        }
      }

      this.loadProducts();
    });

    if (this.isFilterVisible()) {
      document.body.style.overflow = 'hidden';
    }
  }

  private categoryTree: FilterOption[] = [];
  private readonly ALLOWED_MAIN_CATEGORIES = ['Ayakkabı', 'Giyim', 'Aksesuar', 'Diğer'];

  loadCategories(): void {
    this.productService.getCategoryTree().subscribe({
        next: (categories) => {
            // STRICT FILTERING and ORDERING: Ayakkabı - Giyim - Aksesuar - Diğer
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

            // Initial fill for Ana Kategori
            const updated = this.filterGroups().map(g => {
                if (g.key === 'main-category') {
                    return { ...g, options: this.categoryTree };
                }
                return g;
            });
            this.filterGroups.set(updated);
            
            // Trigger subcategories if any main category is pre-selected
            this.updateSubCategories();
        }
    });
  }

  updateSubCategories(): void {
    const selectedMain = this.selectedFilters()
        .filter(f => f.group === 'Ana Kategori')
        .map(f => f.option);
    
    let subOptions: FilterOption[] = [];
    
    if (selectedMain.length > 0) {
        selectedMain.forEach(mainName => {
            const parent = this.categoryTree.find(c => c.label === mainName);
            if (parent && parent.subOptions) {
                subOptions.push(...parent.subOptions);
            }
        });
    }

    const updated = this.filterGroups().map(g => {
        if (g.key === 'sub-category') {
            return { ...g, options: subOptions };
        }
        return g;
    });
    this.filterGroups.set(updated);
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.currentPage.set(1);
    this.hasMore.set(true);

    const filterParams = this.getUnifiedFilterParams();
    
    // Eğer filtre veya arama varsa filter API'sini, yoksa standart API'yi kullan
    const productStream = (filterParams.genders?.length || filterParams.brands?.length || filterParams.categoryIds?.length || filterParams.searchTerm)
        ? this.productService.getProductsByFilter(filterParams.genders, filterParams.brands, filterParams.categoryIds, filterParams.searchTerm, 1, this.pageSize)
        : this.productService.getProducts(1, this.pageSize);

    productStream.subscribe({
      next: (data) => {
        this.products.set(data.items);
        this.totalCount.set(data.totalCount);
        this.isLoading.set(false);
        this.hasMore.set(data.items.length < data.totalCount);
      },
      error: (err) => {
        console.error('Ürünler yüklenirken hata oluştu:', err);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Fetches the next set of items while maintaining current filter state.
   */
  loadMore(): void {
    if (this.isMoreLoading() || !this.hasMore()) return;

    this.isMoreLoading.set(true);
    const nextPage = this.currentPage() + 1;
    const filterParams = this.getUnifiedFilterParams();

    const productStream = (filterParams.genders?.length || filterParams.brands?.length || filterParams.categoryIds?.length || filterParams.searchTerm)
        ? this.productService.getProductsByFilter(filterParams.genders, filterParams.brands, filterParams.categoryIds, filterParams.searchTerm, nextPage, this.pageSize)
        : this.productService.getProducts(nextPage, this.pageSize);

    productStream.subscribe({
        next: (responseData) => {
            if (responseData.items.length > 0) {
                this.products.update(prev => [...prev, ...responseData.items]);
                this.totalCount.set(responseData.totalCount);
                this.currentPage.set(nextPage);
                this.hasMore.set(this.products().length < responseData.totalCount);
            } else {
                this.hasMore.set(false);
            }
            this.isMoreLoading.set(false);
        },
        error: (err: any) => {
            console.error('Daha fazla ürün yüklenirken hata:', err);
            this.isMoreLoading.set(false);
        }
    });
  }

  private getUnifiedFilterParams() {
    const selected = this.selectedFilters();
    
    const genders = selected.filter(f => f.group === 'Cinsiyet').map(f => f.value as number);
    const brands = selected.filter(f => f.group === 'Marka').map(f => f.value as string);
    const categoryIds = selected
        .filter(f => f.group === 'Ana Kategori' || f.group === 'Alt Kategori')
        .map(f => f.value as string);
    const searchTerm = this.searchTerm();

    return { genders, brands, categoryIds, searchTerm };
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
