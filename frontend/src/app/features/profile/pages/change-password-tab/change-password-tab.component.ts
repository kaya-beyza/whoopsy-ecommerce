import { Component } from '@angular/core';

@Component({
  selector: 'app-change-password-tab',
  standalone: true,
  template: `
    <section>
      <h2 class="page-title">Şifre Değiştir</h2>
      <p class="page-subtitle">Bu özellik yakında eklenecek.</p>
      <div class="placeholder">
        <div class="placeholder-icon">🔒</div>
        <p>Şifre değiştirme akışı henüz tamamlanmadı. İleride buradan parolanı güncelleyebileceksin.</p>
      </div>
    </section>
  `,
  styles: [`
    .page-title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px;
      color: #000;
    }
    .page-subtitle {
      color: #666;
      font-size: 14px;
      margin: 0 0 24px;
    }
    .placeholder {
      padding: 60px 20px;
      text-align: center;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
    }
    .placeholder-icon { font-size: 48px; margin-bottom: 12px; }
    .placeholder p { color: #666; font-size: 14px; max-width: 360px; margin: 0 auto; line-height: 1.5; }
  `]
})
export class ChangePasswordTabComponent {}
