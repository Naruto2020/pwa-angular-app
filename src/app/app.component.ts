import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'teik';

  constructor(private translate: TranslateService) {
    // Langue par défaut
    translate.setDefaultLang('en');

    // Détection automatique de la langue du navigateur
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang?.match(/fr|en|es/) ? browserLang : 'en');
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
