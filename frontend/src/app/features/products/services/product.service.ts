import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Gelecekte gerçek API URL'i buraya gelecek
  private apiUrl = 'api/products'; 

  constructor(private http: HttpClient) { }

  /**
   * Ürünleri getirir. Şu an için mock veri döner, 
   * ancak HttpClient yapısı hazırdır.
   */
  getProducts(): Observable<Product[]> {
    // Gerçek API'ye bağlamak için:
    // return this.http.get<Product[]>(this.apiUrl);
    
    return of(this.MOCK_PRODUCTS).pipe(delay(800)); // API gecikmesini simüle ediyoruz
  }

  private MOCK_PRODUCTS: Product[] = [
    {
      id: 1,
      name: 'Nike Air Max Pulse',
      description: 'Geleceğin ikonik tasarımı.',
      price: 4899,
      originalPrice: 5299,
      discountLabel: '%8 İndirim',
      imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/615a133b-8260-4638-9e5c-7d722d861614/AIR+MAX+PULSE.png',
      hoverImageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f4705307-5503-4639-b903-5e9282379373/AIR+MAX+PULSE.png',
      brand: 'Nike',
      category: 'Ayakkabı',
      subCategory: 'Spor Ayakkabı',
      rating: 4.8,
      stock: 12,
      isBestseller: true,
      slug: 'nike-air-max-pulse',
      sizes: [38, 39, 40, 41, 42, 43],
      colors: ['Siyah', 'Beyaz']
    },
    {
      id: 2,
      name: 'adidas Samba OG',
      description: 'Klasik futbol stilinin sokak modasına dönüşü.',
      price: 3650,
      imageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3bb35ad3757a41908ce9acbb011acc58_9366/Samba_OG_Shoes_White_B75806_01_standard.jpg',
      hoverImageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/202685764f7b44fab7a5acbb011ba2db_9366/Samba_OG_Shoes_White_B75806_02_standard_hover.jpg',
      brand: 'adidas',
      category: 'Ayakkabı',
      subCategory: 'Lifestyle',
      rating: 4.9,
      stock: 25,
      isNew: true,
      slug: 'adidas-samba-og-white',
      sizes: [36, 37, 38, 40],
      colors: ['Beyaz', 'Siyah']
    },
    {
      id: 3,
      name: 'New Balance 530 White Silver Metallic',
      description: 'Retro koşu tarzı modern konforla buluştu.',
      price: 3990,
      imageUrl: 'https://nb.scene7.com/is/image/NB/mr530sg_nb_02_i?$pdp_main_desktop$&bgc=f1f1f1&fmt=webp',
      hoverImageUrl: 'https://nb.scene7.com/is/image/NB/mr530sg_nb_03_i?$pdp_main_desktop$&bgc=f1f1f1&fmt=webp',
      brand: 'New Balance',
      category: 'Ayakkabı',
      subCategory: 'Retro Running',
      rating: 4.7,
      stock: 5,
      isBestseller: true,
      slug: 'new-balance-530-white-silver',
      sizes: [40, 41, 42, 44],
      colors: ['Beyaz', 'Gümüş']
    },
    {
      id: 4,
      name: 'Puma Palermo Special Leather',
      description: '80\'lerin teras stilini geri getiriyoruz.',
      price: 2999,
      originalPrice: 3499,
      discountLabel: '%14 İndirim',
      imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/397544/03/sv01/fnd/TUR/fmt/png/Palermo-Special-L-Ayakkab%C4%B1',
      brand: 'Puma',
      category: 'Ayakkabı',
      subCategory: 'Sneaker',
      rating: 4.5,
      stock: 0,
      slug: 'puma-palermo-special',
      sizes: [38, 40, 42],
      colors: ['Bej', 'Kahverengi']
    },
    {
      id: 5,
      name: 'Converse Chuck 70 Vintage Canvas',
      description: 'Asla eskimeyen zamansız klasik.',
      price: 2450,
      imageUrl: 'https://www.converse.com.tr/media/catalog/product/1/6/162050c_1.jpg',
      brand: 'Converse',
      category: 'Ayakkabı',
      subCategory: 'Yüksek Bilekli',
      rating: 4.9,
      stock: 30,
      isNew: true,
      slug: 'converse-chuck-70-vintage',
      sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
      colors: ['Siyah', 'Ekru']
    },
    {
      id: 6,
      name: 'Vans Old Skool Stackform',
      description: 'Daha yüksek, daha cesur.',
      price: 2200,
      imageUrl: 'https://images.vans.com/is/image/Vans/VN0A7Q5M6BT-HERO?wid=800&hei=1004&fmt=jpeg&qlt=85',
      brand: 'Vans',
      category: 'Ayakkabı',
      subCategory: 'Platform',
      rating: 4.6,
      stock: 18,
      slug: 'vans-old-skool-stackform',
      sizes: [36, 37, 38, 39, 40],
      colors: ['Siyah', 'Beyaz']
    }
  ];
}
