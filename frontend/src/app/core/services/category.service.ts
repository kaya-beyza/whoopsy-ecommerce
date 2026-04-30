import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface NavCategory {
  id: string;
  label: string;
  highlight: boolean;
  parentId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:5277/api/Categories';

  constructor(private http: HttpClient) { }

  /**
   * Fetches categories from the backend and
   * Maps API response to NavCategory model for navigation support.
   */
  getCategories(): Observable<NavCategory[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(backendCaps => {
        // Backend'den gelenleri dönüştürüyoruz
        return backendCaps.map(c => ({
          id: c.id.toString(),
          label: c.name,
          highlight: false,
          parentId: c.parentId ? c.parentId.toString() : undefined
        }));
      }),
      catchError(err => {
        console.error('Category load error:', err);
        return of([]);
      })
    );
  }
}
