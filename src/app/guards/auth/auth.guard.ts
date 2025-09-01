import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const isAuthenticated = auth.isLoggedIn();

  if (isAuthenticated) {
    return true;
  }

  auth.navigateByUrl('/login');
  return false;
};
