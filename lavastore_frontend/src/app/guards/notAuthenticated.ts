import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const notAuthenticatedGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  const notificationService = inject(NotificationService);
  notificationService.showError('You are already logged in');

  const previousUrl = router.url;
  return router.parseUrl(previousUrl);
};