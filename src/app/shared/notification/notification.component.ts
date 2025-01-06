import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  template: `
    <div *ngIf="notification" 
         class="notification-container"
         [ngClass]="'notification-' + notification.type">
      <div class="notification-content">
        <i class="fas" [ngClass]="getIcon()"></i>
        <span>{{ notification.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 4px;
      z-index: 1050;
      animation: slideIn 0.5s ease-out;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .notification-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .notification-error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .notification-warning {
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }

    .notification-info {
      background-color: #cce5ff;
      color: #004085;
      border: 1px solid #b8daff;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification: { message: string; type: string } | null = null;
  private subscription: Subscription | null = null;
  private timeout: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(notification => {
      this.showNotification(notification);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  private showNotification(notification: { message: string; type: string }) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    
    this.notification = notification;
    
    this.timeout = setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  getIcon(): string {
    switch (this.notification?.type) {
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-times-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'info':
        return 'fa-info-circle';
      default:
        return 'fa-bell';
    }
  }
}
