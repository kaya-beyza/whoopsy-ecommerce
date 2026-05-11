import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDate: string;
  gender?: string;
  isActive?: boolean;
  roleName?: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  phoneNumber: string;
  address: string;
  birthDate: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/users/me`;

  getMe(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.baseUrl);
  }

  updateMe(payload: UpdateProfilePayload): Observable<UpdateProfileResponse> {
    return this.http.put<UpdateProfileResponse>(this.baseUrl, payload);
  }
}
