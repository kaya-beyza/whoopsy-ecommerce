import { Injectable, signal } from '@angular/core';

export interface AppNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Reactive notification state management
  private notificationsSignal = signal<AppNotification[]>([]);
  notifications = this.notificationsSignal.asReadonly();

  private counter = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = ++this.counter;
    const notification: AppNotification = { id, message, type };
    
    this.notificationsSignal.update(prev => [...prev, notification]);

    // Auto-dismiss notification after 5 seconds
    setTimeout(() => {
      this.remove(id);
    }, 5000);
  }

  remove(id: number) {
    this.notificationsSignal.update(prev => prev.filter(n => n.id !== id));
  }
}
