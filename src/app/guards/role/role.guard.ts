import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { GlobalService } from '../../services/global/global.service';
import { AuthService } from '../../services/auth/auth.service';

export const roleGuard: CanActivateFn = async (route, segments) => {
  const profileService = inject(ProfileService);
  const global = inject(GlobalService);
  const auth = inject(AuthService);

  const profile = await profileService.getProfile();
  console.log(profile);

  const role = route.data?.['role'];

  if (profile?.role && profile?.role === role) {
    return true;
  }

  auth.navigateByUrl('/app');

  await global.showAlert(
    'Unauthorized Access!',
   'You are not authorized to access this path. Contact Administrator for further information.',
    'OK',
  );

  return false;
};
