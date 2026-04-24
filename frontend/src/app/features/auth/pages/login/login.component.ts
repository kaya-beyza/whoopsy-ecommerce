import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoginRequest } from '../../../../core/models/auth.model';
import { inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  cdnUrl = environment.cdnUrl;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  private notificationService = inject(NotificationService);

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    // Eyeball move logic (max +/- 4px)
    const moveX = (x - 50) / 12.5;
    const moveY = (y - 50) / 12.5;

    document.documentElement.style.setProperty('--eye-x', `${moveX}px`);
    document.documentElement.style.setProperty('--eye-y', `${moveY}px`);
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email ve şifre alanları zorunludur.';
      return;
    }

    // ───── TEST LOGIN ─────
    if (this.email === 'admin@admin.com' && this.password === 'admin123') {
      this.authService.setSession('fake-test-token', 'fake-refresh-token');
      this.router.navigate(['/']);
      return;
    }
    // ───── TEST LOGIN END ─────

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
        this.errorMessage = err.error?.Message || 'E-posta veya şifre hatalı.';
      }
    });
  }

  onSocialLogin(provider: string): void {
    this.notificationService.show(`${provider} servisi ile güvenli bağlantı kuruluyor...`, 'info');
    
    setTimeout(() => {
      // Simulate social login session activation
      this.authService.setSession('social-demo-token', 'social-refresh-token');
      this.notificationService.show(`${provider} hesabı ile giriş başarılı! Hoş geldin.`, 'success');
      this.router.navigate(['/']);
    }, 1800);
  }
}
