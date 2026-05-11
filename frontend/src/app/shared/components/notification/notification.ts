import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Global Notification Container -->
    <div class="notification-container">
      @for (note of notificationService.notifications(); track note.id) {
        <div class="toast-elite" [class]="note.type" (click)="notificationService.remove(note.id)">
          <div class="toast-accent"></div>
          <div class="toast-content">
            <span class="material-symbols-sharp toast-icon">
              {{ note.type === 'success' ? 'check_circle' : note.type === 'error' ? 'error' : 'info' }}
            </span>
            <span class="toast-msg">{{ note.message }}</span>
          </div>
          <button class="close-btn">
            <span class="material-symbols-sharp">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 32px;
      right: 32px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }

    .toast-elite {
      pointer-events: auto;
      max-width: 380px;
      background: rgba(250, 246, 240, 0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 12px;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      transform-origin: right top;
      animation: toastIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &.success .toast-icon { color: #10b981; }
      &.error .toast-icon { color: #dc2626; }
      &.info .toast-icon { color: #3b82f6; }
    }

    .toast-accent {
      position: absolute;
      left: 0;
      top: 0;
      width: 5px;
      height: 100%;
      background: #dc2626; /* Primary error color */
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 14px;

      .toast-icon {
        font-size: 24px;
        font-variation-settings: 'wght' 300;
      }

      .toast-msg {
        color: #1a1a1a;
        font-family: var(--font-body, 'Inter', sans-serif);
        font-size: 14px;
        font-weight: 500;
        line-height: 1.4;
        letter-spacing: -0.1px;
      }
    }

    .close-btn {
      background: transparent;
      border: none;
      color: rgba(0, 0, 0, 0.2);
      cursor: pointer;
      padding: 2px;
      display: flex;
      transition: color 0.2s;

      &:hover { color: #000; }
      .material-symbols-sharp { font-size: 20px; font-variation-settings: 'wght' 300; }
    }

    @keyframes toastIn {
      from { opacity: 0; transform: translateX(40px) scale(0.9); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
  `]
})
export class NotificationComponent {
  public notificationService = inject(NotificationService);
}
