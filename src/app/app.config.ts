import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DatePipe } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPrintModule } from 'ngx-print';
// import { TokenInterceptor } from './services/token-interceptor/token-interceptor';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { TokenInterceptor } from './services/token-interceptor/token-interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    DatePipe,
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([TokenInterceptor]), withFetch()),
    importProvidersFrom(
      // NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
      NgxSpinnerModule,
      ToastrModule.forRoot(),
      ModalModule.forRoot(),
      NgxPrintModule
    ),
    provideClientHydration(withEventReplay()),
    provideNativeDateAdapter(), // mat-datepicker
  ],
};
