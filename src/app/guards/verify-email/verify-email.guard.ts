import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { GlobalService } from '../../services/global/global.service';

export const verifyEmailGuardGuard: CanActivateFn = async (route, state) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);
  const global = inject(GlobalService);

  // Ensure profile is loaded (fetch if not)
  const res = await profileService.getProfile();
  const emailVerified = res?.data?.email_verified === 'true' || res?.email_verified === 'true';

  if (!emailVerified && state.url !== '/verification') {
    //user is not verified, force him to verify
    return router.navigateByUrl('/verification', { replaceUrl: true });
  }

  if (emailVerified && state.url === '/verification') {
    //user is verified, force him to go to dashboard
    return router.navigateByUrl('/app/dashboard', { replaceUrl: true });
  }
  return true;
};
