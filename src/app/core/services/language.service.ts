import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly languages = ['fr', 'en', 'nl'] as const;

  constructor(private translate: TranslateService) {
    const saved = (localStorage.getItem('lang') as string) || 'fr';
    this.translate.use(saved);
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  getCurrentLang(): string {
    return this.translate.currentLang || 'fr';
  }
}
