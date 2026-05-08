import { HttpInterceptorFn } from '@angular/common/http';

// Lit directement localStorage — translate.currentLang est undefined au premier rendu
// avant que ngx-translate finisse de charger le fichier de traduction.
export const langInterceptor: HttpInterceptorFn = (req, next) => {
  const lang = localStorage.getItem('lang') || 'fr';
  return next(req.clone({ setHeaders: { 'Accept-Language': lang } }));
};
