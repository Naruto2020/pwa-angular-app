import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root' // singleton global
})
export class I18nService {
  constructor(private translate: TranslateService) {
    // Langue par défaut
    this.translate.setDefaultLang('en');

    // Détection automatique du navigateur
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|fr|es/) ? browserLang : 'en');
  }

  // Changer la langue
  changeLang(lang: string) {
    this.translate.use(lang);
  }

  // Récupérer la langue actuelle
  getCurrentLang(): string {
    return this.translate.currentLang || this.translate.defaultLang;
  }
}
