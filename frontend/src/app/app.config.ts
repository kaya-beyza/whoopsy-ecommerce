import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {

  providers: [ //"Bu uygulamada şu servisler kullanılacak" listesi.
    provideBrowserGlobalErrorListeners(),   // Angular'ın varsayılan hata yakalayıcısı
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'enabled'
    })),                   // Routing sistemi (URL → Component eşleşmesi)

    provideHttpClient(withInterceptors([authInterceptor]))  
  ]
};