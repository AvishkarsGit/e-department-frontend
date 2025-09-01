import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

if (environment.production) {
  const noop = () => {};

  const methods = ['log', 'warn', 'error', 'info', 'debug', 'trace', 'time', 'timeEnd'] as const;

  methods.forEach((method) => {
    if (typeof console[method] === 'function') {
      console[method] = noop;
    }
  });
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
