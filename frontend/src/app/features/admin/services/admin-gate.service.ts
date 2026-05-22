import { Injectable, signal } from '@angular/core';

// Gate password'ün geçici hafızası.
// Admin başvuru akışı 2 adımlı: önce gate, sonra register.
// Component'lar arası taşınması için singleton servis kullanıyoruz.
// Sayfa yenilendiğinde state sıfırlanır (kasıtlı — sessionStorage'a koymadık ki gate her oturumda tekrar girilsin).
@Injectable({ providedIn: 'root' })
export class AdminGateService {
  private gatePassword = signal<string | null>(null);

  setVerified(password: string): void {
    this.gatePassword.set(password);
  }

  getPassword(): string | null {
    return this.gatePassword();
  }

  isVerified(): boolean {
    return this.gatePassword() !== null;
  }

  clear(): void {
    this.gatePassword.set(null);
  }
}
