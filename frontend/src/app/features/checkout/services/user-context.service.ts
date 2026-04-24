import { Injectable, inject } from '@angular/core';
import { TokenService } from '../../../core/services/token.service';

interface JwtPayload {
  [key: string]: unknown;
  nameid?: string;
  sub?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
}

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private tokenService = inject(TokenService);

  getUserId(): string | null {
    const token = this.tokenService.getAccessToken();
    if (!token) return null;

    const payload = this.decodePayload(token);
    if (!payload) return null;

    return (
      payload.nameid ??
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] as string | undefined ??
      payload.sub ??
      null
    );
  }

  private decodePayload(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }
}
