import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-tab.component.html',
  styleUrls: ['./profile-tab.component.css']
})
export class ProfileTabComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);

  form: FormGroup;
  email = signal<string>('');
  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  message = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  constructor() {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+90|0)?5\d{9}$/)]],
      address: ['', [Validators.required, Validators.maxLength(500)]],
      birthDate: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.profileService.getMe().subscribe({
      next: (user) => {
        this.email.set(user.email);
        this.form.patchValue({
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          address: user.address,
          birthDate: user.birthDate ? user.birthDate.split('T')[0] : ''
        });
        this.loading.set(false);
      },
      error: () => {
        this.message.set({ type: 'error', text: 'Profil bilgileri yüklenemedi.' });
        this.loading.set(false);
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.message.set(null);

    const payload = this.form.value;

    this.profileService.updateMe(payload).subscribe({
      next: (res) => {
        this.saving.set(false);
        if (res.success) {
          this.message.set({ type: 'success', text: res.message || 'Profil güncellendi.' });
        } else {
          this.message.set({ type: 'error', text: res.message || 'Güncelleme başarısız.' });
        }
      },
      error: (err) => {
        this.saving.set(false);
        const errorMsg = err?.error?.message
          || err?.error?.errors?.[0]?.errorMessage
          || 'Sunucu hatası oluştu.';
        this.message.set({ type: 'error', text: errorMsg });
      }
    });
  }

  hasError(field: string, errorType: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.touched && control.hasError(errorType));
  }
}
