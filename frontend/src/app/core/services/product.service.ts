import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
// İki modelimizi de aynı dosyadan (product.model.ts) çağırıyoruz
import { Product, CreateProduct } from '../models/product.model'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Arkadaşının belirlediği API adresi (Gerekirse güncelleyin)
  private apiUrl = `${environment.apiUrl}/Products`; 

  constructor(private http: HttpClient) { }

  // 1. Ürünleri Listeleme (GET İsteği)
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // 2. Yeni Ürün Ekleme (POST İsteği)
  createProduct(productData: CreateProduct): Observable<string> {
    return this.http.post<string>(this.apiUrl, productData);
  }

  // 3. Tekil Ürün Getirme (GET by ID İsteği) - AZ ÖNCEKİ HATAYI ÇÖZEN KISIM
  getProductById(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  // 4. Ürün Güncelleme (PUT İsteği)
  updateProduct(id: string, productData: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, productData);
  }

  // 5. Ürün Silme / Pasife Alma (DELETE İsteği)
  deleteProduct(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
}