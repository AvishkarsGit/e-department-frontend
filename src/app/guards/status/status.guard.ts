import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';

export const statusGuard: CanActivateFn = async (route, state) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);
  const profile = await profileService.getProfile();
  const isActive =
    profile?.data?.account_status === true || profile?.account_status === true;
  if (!isActive) {
    router.navigateByUrl('/unauthorized', { replaceUrl: true });
    return false;
  }
  return true;
};
