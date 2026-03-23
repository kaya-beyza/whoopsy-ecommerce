import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { LoginRequest } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email ve şifre alanları zorunludur.';
      return;
    }

    // ───── GEÇİCİ TEST GİRİŞİ ─────
    // Backend hazır olmadığı için sabit email/şifre ile giriş yapıyoruz
    // ÖNEMLİ: Backend bağlanınca bu bloğu SİL!
    if (this.email === 'admin@admin.com' && this.password === 'admin123') {
      // Sahte token kaydet — authGuard bunu görsün yeter
      this.tokenService.setTokens('fake-test-token', 'fake-refresh-token');
      this.router.navigate(['/users']);
      return;
    }
    // ───── GEÇİCİ TEST GİRİŞİ SON ─────

    this.isLoading = true;
    this.errorMessage = '';

    const request: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.login(request).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.Message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
      }
    });
  }
}