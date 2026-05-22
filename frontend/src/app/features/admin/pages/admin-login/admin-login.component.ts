import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    const moveX = (x - 50) / 12.5;
    const moveY = (y - 50) / 12.5;
    document.documentElement.style.setProperty('--eye-x', `${moveX}px`);
    document.documentElement.style.setProperty('--eye-y', `${moveY}px`);
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'E-posta ve şifre alanları zorunludur.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request: LoginRequest = { email: this.email, password: this.password };

    this.authService.login(request).subscribe({
      next: () => {
        // Login başarılı; ancak role Admin değilse oturumu hemen kapat ve hata göster.
        const user = this.authService.currentUser();
        if (user?.role !== 'Admin') {
          this.authService.logout();
          this.isLoading = false;
          this.errorMessage = 'Bu sayfa yalnızca admin hesaplarına açıktır.';
          return;
        }
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.Message || err.error?.message || 'E-posta veya şifre hatalı.';
      }
    });
  }
}
