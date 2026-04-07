import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = 'http://localhost:5000/api/categories';

  constructor(private http: HttpClient) {}

  // 🔥 GET
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  // 🔥 CREATE
  createCategory(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // 🔥 UPDATE
  updateCategory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // 🔥 DELETE
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}