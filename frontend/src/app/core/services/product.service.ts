import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// İki modelimizi de aynı dosyadan (product.model.ts) çağırıyoruz
import { Product, CreateProduct } from '../models/product.model'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Arkadaşının belirlediği API adresi (Gerekirse güncelleyin)
  private apiUrl = 'http://localhost:5000/api/products'; 

  constructor(private http: HttpClient) { }

  // 1. Ürünleri Listeleme (GET İsteği - Daha önce yazdığımız)
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // 2. YENİ: Yeni Ürün Ekleme (POST İsteği)
  createProduct(productData: CreateProduct): Observable<string> {
    // apiUrl adresine git ve productData paketini (gövde/body) backend'e teslim et
    return this.http.post<string>(this.apiUrl, productData);
  }
}