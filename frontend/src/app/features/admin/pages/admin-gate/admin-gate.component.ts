import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AdminGateService } from '../../services/admin-gate.service';

@Component({
  selector: 'app-admin-gate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-gate.component.html',
  styleUrl: './admin-gate.component.scss'
})
export class AdminGateComponent {
  private adminService = inject(AdminService);
  private gateService = inject(AdminGateService);
  private router = inject(Router);

  gatePassword: string = '';
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

  onSubmit(): void {
    if (!this.gatePassword) {
      this.errorMessage = 'Erişim şifresi zorunludur.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.verifyGate({ gatePassword: this.gatePassword }).subscribe({
      next: () => {
        // Gate password doğru. Şifreyi servise yaz, register sayfasına yönlendir.
        this.gateService.setVerified(this.gatePassword);
        this.router.navigate(['/admin/register']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erişim şifresi hatalı.';
      }
    });
  }
}
