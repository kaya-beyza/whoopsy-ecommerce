import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto, OrderDto } from '../models/user.model';

// @Injectable → Angular'a "bu sınıf bir servis, DI sistemine kaydet" diyor
@Injectable({ providedIn: 'root' })
export class UserService {

    // Backend API'nin base URL'i
    private baseUrl = "http://localhost:5079/api/users";

    // HttpClient'ı constructor'da inject ediyoruz
    // Angular DI sistemi bunu otomatik sağlıyor
    constructor(private http: HttpClient) { }

    // GET /api/users → Tüm kullanıcıları getirir
    // Observable<UserDto[]> → "UserDto dizisi döndüren bir Observable" demek
    // Component subscribe olduğunda istek atılır, cevap gelince UserDto[] olarak döner
    getAll(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(this.baseUrl);
    }

    // GET /api/users/{id} → Tek kullanıcıyı getirir
    // Template literal (backtick) ile URL'e id'yi ekliyoruz
    getById(id: string): Observable<UserDto> {
        return this.http.get<UserDto>(`${this.baseUrl}/${id}`);
    }

    // GET /api/users/{id}/orders → Kullanıcının sipariş geçmişini getirir
    // OrderDto[] → Sipariş listesi döner
    getOrderHistory(userId: string): Observable<OrderDto[]> {
        return this.http.get<OrderDto[]>(`${this.baseUrl}/${userId}/orders`);
    }



}