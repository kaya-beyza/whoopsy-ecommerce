import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface NavCategory {
  id: string;
  label: string;
  highlight: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:5277/api/Categories';

  constructor(private http: HttpClient) { }

  /**
   * 🌟 Whoopsy Zekası: Backend'den kategorileri çeker ve 
   * Navbar'ın anlayacağı asaletli formata (NavCategory) dönüştürür.
   */
  getCategories(): Observable<NavCategory[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(backendCaps => {
        // Backend'den gelenleri dönüştürüyoruz
        const dynamicCats = backendCaps.map(c => ({
          id: c.id.toString(),
          label: c.name,
          highlight: false
        }));

        // 🛡️ Whoopsy Elite+ Öncelikli Menü Öğeleri
        const priorityItems: NavCategory[] = [
          { id: 'yeni', label: 'Yeni Gelenler', highlight: false }
        ];

        // 🛡️ Highlight (İndirim) Öğesi (En sona eklenebilir)
        const highlightItems: NavCategory[] = [
          { id: 'indirim', label: 'İndirim', highlight: true }
        ];

        return [...priorityItems, ...dynamicCats, ...highlightItems];
      }),
      catchError(err => {
        console.error('Whoopsy Kategori Hatası! Veritabanı sessizliği:', err);
        // Artık sahte departmanlara sığınmıyoruz, sadece marka sabitlerini bırakıyoruz.
        return of([
          { id: 'yeni', label: 'Yeni Gelenler', highlight: false },
          { id: 'indirim', label: 'İndirim', highlight: true },
        ]);
      })
    );
  }
}
