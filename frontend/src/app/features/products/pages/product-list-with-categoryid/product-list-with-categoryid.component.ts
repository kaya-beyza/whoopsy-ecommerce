import { Component, OnInit, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, FilterGroup } from '../../models/product.model';
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

  // Breadcrumb
  baseCategoryName = signal('AYAKKABI');
  pageTitle = signal('TÜM AYAKKABILAR');
  breadcrumbItems = signal(['Anasayfa', 'Koleksiyon', 'Ayakkabı']);

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
    const id = this.route.snapshot.params['id'];
    if (id) this.loadProducts(id);
  }

  removeFilter(filter: { group: string, option: string }): void {
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
    if (id === '019d433e-9c19-771a-aee0-08812c0b5562') this.selectedFilters.set([{ group: 'Cinsiyet', option: 'Kadın' }]);
    else if (id === '019d53b6-10cf-78cd-97f1-99f5330f56db') this.selectedFilters.set([{ group: 'Cinsiyet', option: 'Erkek' }]);
    else if (id === '019d53b6-4407-71e7-9b93-958477fe69d1') this.selectedFilters.set([{ group: 'Cinsiyet', option: 'Çocuk' }]);

    this.updateDynamicSizes();
    this.updateHeader();
    if (id) this.loadProducts(id);
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

  // Dynamic filter groups for the sidebar
  filterGroups = signal<FilterGroup[]>([
    {
      name: 'Cinsiyet', key: 'gender', isExpanded: true,
      options: ['Kadın', 'Erkek', 'Çocuk', 'Unisex']
    },
    {
      name: 'Kategori', key: 'category', isExpanded: true,
      options: [] // Loaded dynamically from API
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

  ngOnInit(): void {
    // Resolve current category and title based on route parameters and metadata
    this.productService.getCategories().subscribe(categories => {
      this.route.params.pipe(
        switchMap(params => {
          const id = params['id'];
          this.isLoading.set(true);
  
          // 1. Özel Gender GUID'lerini Tanıma
          let label = '';
          let displayLabel = '';
  
          if (id === '019d433e-9c19-771a-aee0-08812c0b5562') {
            label = 'KADIN';
            displayLabel = 'Kadın';
          } else if (id === '019d53b6-10cf-78cd-97f1-99f5330f56db') {
            label = 'ERKEK';
            displayLabel = 'Erkek';
          } else if (id === '019d53b6-4407-71e7-9b93-958477fe69d1') {
            label = 'ÇOCUK';
            displayLabel = 'Çocuk';
          }
  
          // If not a pre-defined gender ID, search within the fetched categories
          if (!label) {
            const foundCat = categories.find(c => c.id === id);
            if (foundCat) {
              label = foundCat.name.toLocaleUpperCase('tr-TR');
              displayLabel = foundCat.name;
            } else {
              label = 'KOLEKSİYON';
              displayLabel = 'Koleksiyon';
            }
          }
  
          this.baseCategoryName.set(label);
          this.breadcrumbItems.set(['Anasayfa', 'Koleksiyon', displayLabel]);
          this.pageTitle.set(`TÜM ${label} ÜRÜNLERİ`);
  
          if (displayLabel === 'Kadın' || displayLabel === 'Erkek' || displayLabel === 'Çocuk') {
            this.selectedFilters.set([{ group: 'Cinsiyet', option: displayLabel }]);
            this.pageTitle.set(`${label} KOLEKSİYONU`);
          } else {
            this.selectedFilters.set([]);
          }
  
          this.updateHeader();

          // Update category filter options in the sidebar
          const categoryNames = categories.map(c => c.name);
          const updatedGroups = this.filterGroups().map(g => {
              if (g.key === 'category') {
                  return { ...g, options: categoryNames };
              }
              return g;
          });
          this.filterGroups.set(updatedGroups);
          
          // Align routing state with hierarchical filtering requirements
          const isGenderId = (id === '019d433e-9c19-771a-aee0-08812c0b5562' || 
                             id === '019d53b6-10cf-78cd-97f1-99f5330f56db' || 
                             id === '019d53b6-4407-71e7-9b93-958477fe69d1');
  
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
    let gender = filterParams.gender;
    if (specialGenderId === '019d433e-9c19-771a-aee0-08812c0b5562') gender = 2; // Kadın
    else if (specialGenderId === '019d53b6-10cf-78cd-97f1-99f5330f56db') gender = 1; // Erkek
    else if (specialGenderId === '019d53b6-4407-71e7-9b93-958477fe69d1') gender = 3; // Çocuk

    this.productService.getProductsByFilter(gender, filterParams.brand, categoryId, undefined, 1, this.pageSize).subscribe({
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
    const id = this.route.snapshot.params['id'];
    const filterParams = this.getUnifiedFilterParams();
    
    // Apply the same gender GUID mapping for hierarchical pagination
    const isGenderId = (id === '019d433e-9c19-771a-aee0-08812c0b5562' || 
                       id === '019d53b6-10cf-78cd-97f1-99f5330f56db' || 
                       id === '019d53b6-4407-71e7-9b93-958477fe69d1');

    let gender = filterParams.gender;
    let finalCategoryId: string | undefined = id;
    
    if (isGenderId) {
        if (id === '019d433e-9c19-771a-aee0-08812c0b5562') gender = 2;
        else if (id === '019d53b6-10cf-78cd-97f1-99f5330f56db') gender = 1;
        else if (id === '019d53b6-4407-71e7-9b93-958477fe69d1') gender = 3;
        finalCategoryId = undefined;
    }

    this.productService.getProductsByFilter(gender, filterParams.brand, finalCategoryId, undefined, nextPage, this.pageSize).subscribe({
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
    
    // Gender mapping: Kadın=2, Erkek=1, Çocuk=3, Unisex=0
    const genderStr = selected.find(f => f.group === 'Cinsiyet')?.option;
    let gender: number | undefined = undefined;
    if (genderStr === 'Erkek') gender = 1;
    else if (genderStr === 'Kadın') gender = 2;
    else if (genderStr === 'Çocuk') gender = 3;
    else if (genderStr === 'Unisex') gender = 0;

    const brand = selected.find(f => f.group === 'Marka')?.option;

    return { gender, brand };
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