import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {

  providers: [ //"Bu uygulamada şu servisler kullanılacak" listesi.
    provideZoneChangeDetection({ eventCoalescing: true }),  // Angular 21: zone.js artık opt-in. HTTP/timer sonrası UI'yı otomatik render eder.
    provideBrowserGlobalErrorListeners(),   // Angular'ın varsayılan hata yakalayıcısı
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'enabled'
    })),                   // Routing sistemi (URL → Component eşleşmesi)

    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};