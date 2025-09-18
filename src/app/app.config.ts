import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient , withInterceptors} from '@angular/common/http';
import { GlobalErrorHandler } from './core/services/error/global-error-handler';
import { loggingInterceptor } from './core/services/products-service/logging.interceptor';
import { cachingInterceptor } from './core/services/products-service/caching.interceptor';



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([loggingInterceptor, cachingInterceptor])
),
    { 
      provide: ErrorHandler, 
      useClass: GlobalErrorHandler 
    }
  ]
};
