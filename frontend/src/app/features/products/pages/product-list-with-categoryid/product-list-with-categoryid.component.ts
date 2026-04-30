import { Component, OnInit, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, FilterGroup, FilterOption } from '../../models/product.model';
import { switchMap } from 'rxjs';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-list-with-categoryid',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './product-list-with-categoryid.component.html',
  styleUrl: './product-list-with-categoryid.component.scss'
})
export class ProductListWithCategoryidComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  isLoading = signal(true);
  isFilterVisible = signal(true);
  quickAddProductId = signal<number | null>(null);
  totalCount = signal(0);

  // Paging Ritimleri
  currentPage = signal(1);
  pageSize = 21;
  hasMore = signal(true);
  isMoreLoading = signal(false);

  // Dinamik Cinsiyet ID'leri (Re-seed dostu ritim 🧿)
  kadinId = signal<string | null>(null);
  erkekId = signal<string | null>(null);
  cocukId = signal<string | null>(null);

  // Breadcrumb
  baseCategoryName = signal('AYAKKABI');
  pageTitle = signal('TÜM AYAKKABILAR');
  breadcrumbItems = signal(['Anasayfa', 'Koleksiyon', 'Ayakkabı']);

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

    if (groupName === 'Ana Kategori') {
        this.updateSubCategories();
    }

    if (groupName === 'Cinsiyet' || groupName === 'Ana Kategori' || groupName === 'Alt Kategori') {
        this.updateDynamicSizes();
    }
    this.updateHeader();
    const id = this.route.snapshot.params['id'];
    if (id) this.loadProducts(id);
  }

  removeFilter(filter: { group: string, option: string, value?: any }): void {
    const current = this.selectedFilters();
    this.selectedFilters.set(current.filter(f => !(f.group === filter.group && f.option === filter.option)));
    this.updateDynamicSizes();
    this.updateHeader();
    const id = this.route.snapshot.params['id'];
    if (id) this.loadProducts(id);
  }

  updateHeader(): void {
    const genderFilters = this.selectedFilters().filter(f => f.group === 'Cinsiyet');
    const baseName = this.baseCategoryName().toLocaleUpperCase('tr-TR');

    if (genderFilters.length === 1 && genderFilters[0].option.toLocaleUpperCase('tr-TR') !== baseName) {
      this.pageTitle.set(`${genderFilters[0].option.toLocaleUpperCase('tr-TR')} ${baseName}`);
    } else {
      this.pageTitle.set(baseName);
    }
  }

  clearFilters(): void {
    const id = this.route.snapshot.params['id'];
    this.selectedFilters.set([]);
    
    // Restore default gender filter for specific categories based on GUID
    if (id === '019d433e-9c19-771a-aee0-08812c0b5562') this.selectedFilters.set([{ group: 'Cinsiyet', option: 'Kadın', value: 2 }]);
    else if (id === '019d53b6-10cf-78cd-97f1-99f5330f56db') this.selectedFilters.set([{ group: 'Cinsiyet', option: 'Erkek', value: 1 }]);
    else if (id === '019d53b6-4407-71e7-9b93-958477fe69d1') this.selectedFilters.set([{ group: 'Cinsiyet', option: 'Çocuk', value: 3 }]);

    this.updateDynamicSizes();
    this.updateHeader();
    if (id) this.loadProducts(id);
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
        const sizeOptions: FilterOption[] = uniqueSizes.map(s => ({ label: s, value: s }));
        return { ...g, options: sizeOptions };
      }
      return g;
    });
    
    this.filterGroups.set(updated);
  }

  // Dynamic filter groups for the sidebar
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

  ngOnInit(): void {
    // Resolve current category and title based on route parameters and metadata
    this.productService.getCategoryTree().subscribe(categories => {
      this.route.params.pipe(
        switchMap(params => {
          const id = params['id'];
          this.isLoading.set(true);
  
          // 1. Dinamik Categori ve Cinsiyet Tespiti (Pusuya Geçit Yok! 🛡️)
          const flatten = (arr: any[]): any[] => arr.reduce((acc, c) => acc.concat(c, c.subCategories ? flatten(c.subCategories) : (c.SubCategories ? flatten(c.SubCategories) : [])), []);
          const allCats = flatten(categories);
          const foundCat = allCats.find(c => c.id === id);

          let label = '';
          let displayLabel = '';

          // Özel Cinsiyet Gruplarını İsimle Bul (Re-seed dostu ritim 🧿)
          const kadinCat = allCats.find(c => c.name === 'Kadın' && c.parentId === null);
          const erkekCat = allCats.find(c => c.name === 'Erkek' && c.parentId === null);
          const cocukCat = allCats.find(c => c.name === 'Çocuk' && c.parentId === null);

          this.kadinId.set(kadinCat?.id || null);
          this.erkekId.set(erkekCat?.id || null);
          this.cocukId.set(cocukCat?.id || null);

          if (id === this.kadinId()) {
            label = 'KADIN';
            displayLabel = 'Kadın';
          } else if (id === this.erkekId()) {
            label = 'ERKEK';
            displayLabel = 'Erkek';
          } else if (id === this.cocukId()) {
            label = 'ÇOCUK';
            displayLabel = 'Çocuk';
          }
  
          // Eğer cinsiyet ID'si değilse, normal kategori olarak ara
          if (!label && foundCat) {
            label = foundCat.name.toLocaleUpperCase('tr-TR');
            displayLabel = foundCat.name;
          } else if (!label) {
            label = 'KOLEKSİYON';
            displayLabel = 'Koleksiyon';
          }
  
          this.baseCategoryName.set(label);
          this.breadcrumbItems.set(['Anasayfa', 'Koleksiyon', displayLabel]);
          this.pageTitle.set(`TÜM ${label} ÜRÜNLERİ`);
  
          if (displayLabel === 'Kadın' || displayLabel === 'Erkek' || displayLabel === 'Çocuk') {
            const genderVal = displayLabel === 'Kadın' ? 2 : (displayLabel === 'Erkek' ? 1 : 3);
            this.selectedFilters.set([{ group: 'Cinsiyet', option: displayLabel, value: genderVal }]);
            this.pageTitle.set(`${label} KOLEKSİYONU`);
          } else {
            this.selectedFilters.set([]);
          }
  
          this.updateHeader();

          // Initial category tree mapping with STRICT FILTERING and ORDERING
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

          const updatedGroups = this.filterGroups().map(g => {
              if (g.key === 'main-category') {
                  return { ...g, options: this.categoryTree };
              }
              return g;
          });
          this.filterGroups.set(updatedGroups);
          
          // Trigger subcategories if a main category was already selected (e.g. from URL)
          this.updateSubCategories();
          
          // Align routing state with hierarchical filtering requirements
          const isGenderId = (id === kadinCat?.id || id === erkekCat?.id || id === cocukCat?.id);
  
          if (isGenderId) {
              this.loadProducts(undefined, id);
          } else {
              this.loadProducts(id);
          }
          return [];
        })
      ).subscribe();
    });
  }

  loadProducts(categoryId?: string, specialGenderId?: string): void {
    this.isLoading.set(true);
    this.currentPage.set(1);
    this.hasMore.set(true);

    const filterParams = this.getUnifiedFilterParams();
    
    // Map gender GUIDs to the numeric Gender filter for the API call
    let genders = filterParams.genders;
    if (specialGenderId === this.kadinId() && !genders.includes(2)) genders.push(2); // Kadın
    else if (specialGenderId === this.erkekId() && !genders.includes(1)) genders.push(1); // Erkek
    else if (specialGenderId === this.cocukId() && !genders.includes(3)) genders.push(3); // Çocuk

    const categoryIds = filterParams.categoryIds;
    if (categoryId && !categoryIds.includes(categoryId)) categoryIds.push(categoryId);

    this.productService.getProductsByFilter(genders, filterParams.brands, categoryIds, undefined, 1, this.pageSize).subscribe({
      next: (data) => {
        this.products.set(data.items);
        this.totalCount.set(data.totalCount);
        this.isLoading.set(false);
        this.hasMore.set(data.items.length < data.totalCount);
      },
      error: () => this.isLoading.set(false)
    });
  }

  /**
   * Fetches the next page of products based on current category and active filters.
   */
  loadMore(): void {
    if (this.isMoreLoading() || !this.hasMore()) return;

    this.isMoreLoading.set(true);
    const nextPage = this.currentPage() + 1;
    const filterParams = this.getUnifiedFilterParams();
    const id = this.route.snapshot.params['id'];
    
    // Apply the same gender GUID mapping for hierarchical pagination
    const isGenderId = (id === this.kadinId() || id === this.erkekId() || id === this.cocukId());
  
    let genders = filterParams.genders;
    let categoryIds = filterParams.categoryIds;

    if (isGenderId) {
        if (id === this.kadinId() && !genders.includes(2)) genders.push(2);
        else if (id === this.erkekId() && !genders.includes(1)) genders.push(1);
        else if (id === this.cocukId() && !genders.includes(3)) genders.push(3);
    } else {
        if (id && !categoryIds.includes(id)) categoryIds.push(id);
    }

    this.productService.getProductsByFilter(genders, filterParams.brands, categoryIds, undefined, nextPage, this.pageSize).subscribe({
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
            console.error('Daha fazla kategori ürünü yüklenirken hata:', err);
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

    return { genders, brands, categoryIds };
  }

  private categoryTree: FilterOption[] = [];
  private readonly ALLOWED_MAIN_CATEGORIES = ['Ayakkabı', 'Giyim', 'Aksesuar', 'Diğer'];

  loadCategories(): void {
    this.productService.getCategoryTree().subscribe({
        next: (categories) => {
            // STRICT FILTERING and ORDERING: Ayakkabı - Giyim - Aksesuar - Diğer
            const order = ['Ayakkabı', 'Giyim', 'Aksesuar', 'Diğer'];
            this.categoryTree = categories
                .filter(c => order.includes(c.name))
                .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
                .map(c => ({
                    label: c.name,
                    value: c.id,
                    isExpanded: false,
                    subOptions: (c.subCategories || c.SubCategories)?.map((sub: any) => ({
                        label: sub.name,
                        value: sub.id
                    })) || []
                }));

            const updated = this.filterGroups().map(g => {
                if (g.key === 'main-category') {
                    return { ...g, options: this.categoryTree };
                }
                return g;
            });
            this.filterGroups.set(updated);
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

  toggleFilter(): void {
    this.isFilterVisible.set(!this.isFilterVisible());
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