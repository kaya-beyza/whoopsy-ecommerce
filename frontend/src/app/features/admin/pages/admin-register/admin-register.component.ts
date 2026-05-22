import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AdminGateService } from '../../services/admin-gate.service';
import { AdminRegisterRequest } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-register.component.html',
  styleUrl: './admin-register.component.scss'
})
export class AdminRegisterComponent implements OnInit {
  private adminService = inject(AdminService);
  private gateService = inject(AdminGateService);
  private router = inject(Router);

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  gender: number | null = null;
  birthDate: string = '';

  errorMessage: string = '';
  fieldErrors: { [field: string]: string } = {};
  isLoading: boolean = false;
  successMessage: string = '';

  get passwordChecks() {
    const p = this.password;
    return {
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /[0-9]/.test(p)
    };
  }

  ngOnInit(): void {
    // Guard zaten kontrol ediyor; ekstra güvenlik için burada da çıkış var.
    if (!this.gateService.isVerified()) {
      this.router.navigate(['/admin/gate']);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    const moveX = (x - 50) / 12.5;
    const moveY = (y - 50) / 12.5;
    document.documentElement.style.setProperty('--eye-x', `${moveX}px`);
    document.documentElement.style.setProperty('--eye-y', `${moveY}px`);
  }

  clearFieldError(field: string): void {
    if (this.fieldErrors[field]) delete this.fieldErrors[field];
  }

  onRegister(): void {
    if (!this.firstName || !this.lastName || !this.email || !this.password ||
        !this.confirmPassword || !this.phone || !this.birthDate) {
      this.errorMessage = 'Lütfen zorunlu alanları doldurun.';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Geçerli bir e-posta adresi giriniz.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Şifreler eşleşmiyor.';
      return;
    }

    const gatePassword = this.gateService.getPassword();
    if (!gatePassword) {
      this.router.navigate(['/admin/gate']);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.fieldErrors = {};

    const request: AdminRegisterRequest = {
      gatePassword,
      fullName: `${this.firstName} ${this.lastName}`,
      email: this.email,
      phoneNumber: this.phone,
      password: this.password,
      gender: this.gender,
      birthDate: this.birthDate || null
    };

    this.adminService.register(request).subscribe({
      next: () => {
        this.isLoading = false;
        // Başvuru alındı — gate state'ini temizle ki başka biri aynı tarayıcıda yeniden girmesin.
        this.gateService.clear();
        this.successMessage =
          'Başvurun alındı. Onay maili sistem yöneticisine gönderildi. ' +
          'Onaylandıktan sonra admin girişi yapabilirsin.';
      },
      error: (err) => {
        this.isLoading = false;
        const backendErrors: Array<{ field: string; error: string }> = err.error?.errors ?? [];
        this.fieldErrors = {};
        for (const e of backendErrors) {
          this.fieldErrors[e.field] = this.fieldErrors[e.field]
            ? `${this.fieldErrors[e.field]} · ${e.error}`
            : e.error;
        }
        this.errorMessage = backendErrors.length > 0
          ? 'Lütfen aşağıda işaretli alanları düzelt.'
          : (err.error?.message || err.error?.Message || 'Başvuru sırasında bir hata oluştu.');
      }
    });
  }
}
