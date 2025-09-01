import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { computed, inject, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { GlobalService } from '../global/global.service';

export const TokenInterceptor = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);
  const global = inject(GlobalService);

  const refreshingInProgress = signal(false);  // Track refresh status
  const accessToken = signal<string | null>(null);  // Store the latest token

  auth.getToken();
  const token = computed(() => auth.token());  // Get the latest token directly from auth service

  if (!token()) {
    // If no token, proceed with the request as usual without an Authorization header
    return next(req);
  }

  // Add Authorization header if a token is available
  const reqWithToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token()}`,
    },
  });


  return next(reqWithToken).pipe(
    catchError((err) => {
      // Handle token refresh for 401 errors (Unauthorized)
      // if (err.status === 401 && !refreshingInProgress()) {
      //   return handleTokenRefresh(req, next, auth, global, refreshingInProgress, accessToken);
      // }

      console.log('error: ', err);
      
      // Handle other error cases (e.g., 403 Forbidden)
      if (err.status === 401 || err.status === 403) {
        return handleLogout(err, auth, global);
      }

      // For other errors, just return them
      return throwError(() => err);
    })
  );
};

// const handleTokenRefresh = (
//   req: HttpRequest<any>,
//   next: HttpHandlerFn,
//   auth: AuthService,
//   global: GlobalService,
//   refreshingInProgress: any,
//   accessToken: any
// ): Observable<HttpEvent<any>> => {
//   // If token refresh is not in progress, initiate it
//   refreshingInProgress.set(true);
//   accessToken.set(null);  // Reset the token

//   // Call the refresh token API
//   return auth.refreshTokens().pipe(
//     switchMap((response: any) => {
//       // Once refresh is successful, set the new token
//       refreshingInProgress.set(false);
//       accessToken.set(response.accessToken);

//       // Retry the original request with the new token
//       const refreshedReq = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${response.accessToken}`,
//         },
//       });

//       return next(refreshedReq);  // Retry the request
//     }),
//     catchError((err) => {
//       // Handle refresh token failure (logout)
//       refreshingInProgress.set(false);
//       return handleLogout(err, auth, global);
//     })
//   );
// };

const handleLogout = (error: any, auth: AuthService, global: GlobalService) => {
  console.error('Logout due to error: ', error?.error?.message);

  // Log out the user and handle UI-related tasks
  auth.logout();
  global.showAlert('Alert', error, 'OK');  // Show an alert message to the user
  
  return throwError(() => error);  // Return the error to be handled downstream
};
