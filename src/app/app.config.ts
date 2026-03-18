import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { environment } from '../environments/environment';
import { BASE_PATH, Configuration } from './core/api/generated';

// Fix : les services générés ont httpHeaderAccepts = ['*/*'].
// isJsonMime('*/*') retourne false → responseType = 'blob' → réponse non parsée.
// On override isJsonMime pour traiter '*/*' comme du JSON.
function createApiConfiguration(): Configuration {
  const config = new Configuration({ basePath: environment.apiUrl.replace('/api', '') });
  const base = config.isJsonMime.bind(config);
  config.isJsonMime = (mime: string) => mime === '*/*' || base(mime);
  return config;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTranslateService({ defaultLanguage: 'fr' }),
    ...provideTranslateHttpLoader({ prefix: '/assets/i18n/', suffix: '.json' }),

    // ── OpenAPI generated client ─────────────────────────────────────
    { provide: BASE_PATH, useValue: environment.apiUrl.replace('/api', '') },
    { provide: Configuration, useFactory: createApiConfiguration },
  ]
};
