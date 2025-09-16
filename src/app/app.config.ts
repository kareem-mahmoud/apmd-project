import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, 
         inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideTranslateService, TranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { provideHttpClient } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    // provideHttpClient(),
    // provideTranslateService({
    //   lang: 'en',
    //   fallbackLang: 'en',
    //   loader: provideTranslateHttpLoader({
    //     prefix: '/i18n/',
    //     suffix: '.json'
    //   })
    // }),
    // provideAppInitializer(() => {
    //    const  translate = inject(TranslateService);
    //    translate.use(translate.getBrowserLang() || "en");
    //  })

  ]
};
