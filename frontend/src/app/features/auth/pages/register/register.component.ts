import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  cdnUrl = environment.cdnUrl;

  firstName: string = '';
  lastName: string = '';
  fullName: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  gender: number | null = null;
  birthDate: string = '';
  address: string = '';

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  private notificationService = inject(NotificationService);

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    const moveX = (x - 50) / 12.5;
    const moveY = (y - 50) / 12.5;

    document.documentElement.style.setProperty('--eye-x', `${moveX}px`);
    document.documentElement.style.setProperty('--eye-y', `${moveY}px`);
  }

  onRegister(): void {
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword || !this.phone) {
      this.errorMessage = 'Lütfen zorunlu alanları doldurun.';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Geçerli bir email adresi giriniz.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Şifreler eşleşmiyor.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const registerData = {
      fullName: `${this.firstName} ${this.lastName}`,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      password: this.password,
      gender: this.gender,
      birthDate: this.birthDate,
      address: this.address
    };

    console.log('Register Data:', registerData);

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Kayıt başarılı:', response);
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Kayıt sırasında bir hata oluştu.';
      }
    });
  }

  onSocialLogin(provider: string): void {
    this.notificationService.show(`${provider} servisi üzerinden işlem başlatılıyor...`, 'info');
    
    setTimeout(() => {
      // Simulate social registration session activation
      this.authService.setSession('social-demo-token', 'social-refresh-token');
      this.notificationService.show(`${provider} ile hesap oluşturuldu ve giriş yapıldı!`, 'success');
      this.router.navigate(['/']);
    }, 2000);
  }
}