import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  const notificationService = inject(NotificationService);
  notificationService.showError('You must be logged in to view this page');

  return router.parseUrl('/auth/signin');
}; 