import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Hash URLs: GitHub Pages has no server-side routing, and printed QR codes use /#/timeline?event=…
    provideRouter(routes, withHashLocation()),
  ],
};
