import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, delay, catchError, of, throwError } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Gerçek Backend API URL'i (CORS ayarları backend tarafında yapılmış varsayılmaktadır)
  private apiUrl = 'http://localhost:5277/api/products';
  private categoriesUrl = 'http://localhost:5277/api/categories';

  constructor(private http: HttpClient) { }

  /**
   * Veritabanındaki ürünleri getirir ve onları whOOPSy tasarım 
   * standartlarına (Resimler, Markalar, Badge'ler) eşler.
   */
  getProducts(page: number = 1, pageSize: number = 21): Observable<Product[]> {
    return this.http.get<any[]>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`).pipe(
      map(backendProducts => backendProducts.map(bp => this.mapToEliteProduct(bp))),
      catchError(err => {
        console.error('Whoopsy API hatası! Veritabanı sessizliği:', err);
        return of([]);
      })
    );
  }

  /**
   * Backend deryasındaki tüm kategorileri (Kadın, Erkek, Çocuk) Whomopsy asaletinde çeker.
   */
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.categoriesUrl).pipe(
        catchError(err => {
            console.error('Whoopsy Kategori API hatası!:', err);
            return of([]);
        })
    );
  }

  /**
   * Belirtilen kategoriye ait ürünleri getirir.
   */
  getProductsByCategoryId(categoryId: string | number, page: number = 1, pageSize: number = 21): Observable<Product[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-category/${categoryId}?page=${page}&pageSize=${pageSize}`).pipe(
      map(backendProducts => backendProducts.map(bp => this.mapToEliteProduct(bp))),
      catchError(err => {
        console.error('Whoopsy API hatası! Veritabanı sessizliği:', err);
        return of([]);
      })
    );
  }

  /**
   * Belirtilen markaya ait ürünleri getirir.
   */
  getProductsByBrand(brand: string, page: number = 1, pageSize: number = 21): Observable<Product[]> {
    // Whomopsy Brand Alignment: Backend Enum (NewBalance) boşluksuz yapı bekliyor.
    const alignedBrand = brand.replace(/\s/g, ''); 
    return this.http.get<any[]>(`${this.apiUrl}/by-brand?brand=${alignedBrand}&page=${page}&pageSize=${pageSize}`).pipe(
      map(backendProducts => backendProducts.map(bp => this.mapToEliteProduct(bp)).filter(p => p.brand.toLowerCase() === brand.toLowerCase()))
    );
  }

  /**
   * Birden fazla filtreyi (Cinsiyet, Marka, Kategori, Arama) Whosepsy asaletinde Whomopsy deryasına iletir.
   */
  getProductsByFilter(gender?: number, brand?: string, categoryId?: string, searchTerm?: string, page: number = 1, pageSize: number = 21): Observable<Product[]> {
    let url = `${this.apiUrl}/filter?page=${page}&pageSize=${pageSize}`;
    if (gender !== undefined) url += `&gender=${gender}`;
    if (brand) url += `&brand=${brand.replace(/\s/g, '')}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (searchTerm) url += `&searchTerm=${encodeURIComponent(searchTerm)}`;

    return this.http.get<any[]>(url).pipe(
      map(backendProducts => backendProducts.map(bp => this.mapToEliteProduct(bp))),
      catchError(err => {
        console.error('Whoopsy Filtreleme Hatası! Veritabanı sessizliği:', err);
        return of([]);
      })
    );
  }

  /**
   * Belirtilen ID'ye sahip ürünü veritabanından getirir.
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(bp => this.mapToEliteProduct(bp)),
      catchError(err => {
        console.error('Whoopsy Ürün Detay Hatası! Bu ürün veritabanında mühürlenmemiş:', err);
        return throwError(() => new Error('Ürün bulunamadı.'));
      })
    );
  }

  private mapToEliteProduct(bp: any): Product {
    const name = bp.name || 'Whoopsy Ürünü';
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // Whomopsy Elite Mapping: Sayısal Şifreleri Çözme
    const brandName = this.getBrandName(bp.brand);
    const genderName = this.getGenderName(bp.gender);

    // Görsel havuzundan marka ve kategoriye göre eşleme (Backend linki bozuksa veya yoksa)
    const visualPool = this.ELITE_MOCK_POOL.find(p =>
      p.brand.toLowerCase() === brandName.toLowerCase()
    ) || this.ELITE_MOCK_POOL[0];

    // Backend'den gelen resim yolunu Whomopsy asaletinde temizleme
    const backendImage = bp.mainImageUrl && bp.mainImageUrl.startsWith('http') ? bp.mainImageUrl : visualPool.imageUrl;

    return {
      id: bp.id || Math.random(),
      name: name,
      description: bp.description || 'Whoopsy asaletini yansıtan özel tasarım.',
      price: bp.price || 0,
      stock: bp.stockQuantity || 0,
      categoryId: bp.categoryId,
      // Visual Enrichment (Whomopsy Elite Entegrasyon):
      brand: brandName,
      category: genderName,
      imageUrl: backendImage,
      hoverImageUrl: bp.imageUrls?.[0] || visualPool.hoverImageUrl,
      images: bp.imageUrls || [backendImage],
      originalPrice: bp.price ? bp.price + 450 : undefined,
      discountLabel: bp.price > 4000 ? '%15 İndirim' : undefined,
      rating: 4.8,
      isBestseller: bp.price > 4500,
      isNew: true,
      slug: slug,
      sizes: [38, 39, 40, 41, 42, 43, 44],
      colors: ['Siyah', 'Beyaz', 'Bej']
    };
  }

  // Whomopsy Codebreaker: Gender Enum Çözücü
  private getGenderName(id: number): string {
    const genders: any = {
      0: 'Unisex',
      1: 'Erkek',
      2: 'Kadın',
      3: 'Çocuk'
    };
    return genders[id] || 'Unisex';
  }

  // Whomopsy Codebreaker: Brand Enum Çözücü
  private getBrandName(id: number): string {
    const brands: any = {
      1: 'Adidas',
      2: 'Converse',
      3: 'New Balance',
      4: 'Nike',
      5: 'Puma',
      6: 'Vans'
    };
    return brands[id] || 'Whoopsy';
  }

  // Visual Pool (Resimler ve Markalar için referans)
  private ELITE_MOCK_POOL: Product[] = [
    {
      id: 1,
      name: 'Air Max Pulse',
      description: 'Geleceğin ikonik tasarımı.',
      price: 4899,
      imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/615a133b-8260-4638-9e5c-7d722d861614/AIR+MAX+PULSE.png',
      hoverImageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f4705307-5503-4639-b903-5e9282379373/AIR+MAX+PULSE.png',
      brand: 'Nike',
      category: 'Ayakkabı',
      categoryId: 1,
      stock: 12,
      slug: 'nike-air-max-pulse',
      sizes: [38, 39, 40, 41, 42, 43],
      colors: ['Siyah', 'Beyaz'],
      rating: 4.8
    },
    {
      id: 2,
      name: 'Samba OG',
      description: 'Klasik futbol stilinin sokak modasına dönüşü.',
      price: 3650,
      imageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3bb35ad3757a41908ce9acbb011acc58_9366/Samba_OG_Shoes_White_B75806_01_standard.jpg',
      hoverImageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/202685764f7b44fab7a5acbb011ba2db_9366/Samba_OG_Shoes_White_B75806_02_standard_hover.jpg',
      brand: 'adidas',
      category: 'Ayakkabı',
      categoryId: 1,
      stock: 25,
      slug: 'adidas-samba-og-white',
      sizes: [36, 37, 38, 40],
      colors: ['Beyaz', 'Siyah'],
      rating: 4.9
    },
    {
      id: 3,
      name: '530 White Silver',
      description: 'Retro koşu tarzı modern konforla buluştu.',
      price: 3990,
      imageUrl: 'https://nb.scene7.com/is/image/NB/mr530sg_nb_02_i?$pdp_main_desktop$&bgc=f1f1f1&fmt=webp',
      hoverImageUrl: 'https://nb.scene7.com/is/image/NB/mr530sg_nb_03_i?$pdp_main_desktop$&bgc=f1f1f1&fmt=webp',
      brand: 'New Balance',
      category: 'Ayakkabı',
      categoryId: 1,
      stock: 5,
      slug: 'new-balance-530-white-silver',
      sizes: [40, 41, 42, 44],
      colors: ['Beyaz', 'Gümüş'],
      rating: 4.7
    },
    {
      id: 4,
      name: 'Palermo Special',
      description: '80\'lerin teras stilini geri getiriyoruz.',
      price: 2999,
      imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/397544/03/sv01/fnd/TUR/fmt/png/Palermo-Special-L-Ayakkab%C4%B1',
      brand: 'Puma',
      category: 'Ayakkabı',
      categoryId: 1,
      stock: 12,
      slug: 'puma-palermo-special',
      sizes: [38, 40, 42],
      colors: ['Bej', 'Kahverengi'],
      rating: 4.5
    },
    {
      id: 5,
      name: 'Chuck 70 Vintage',
      description: 'Asla eskimeyen zamansız klasik.',
      price: 2450,
      imageUrl: 'https://www.converse.com.tr/media/catalog/product/1/6/162050c_1.jpg',
      brand: 'Converse',
      category: 'Ayakkabı',
      categoryId: 1,
      stock: 30,
      slug: 'converse-chuck-70-vintage',
      sizes: [36, 37, 38, 39, 40, 41, 42, 43],
      colors: ['Siyah', 'Ekru'],
      rating: 4.9
    }
  ];
}