import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginService } from '../services/login.service';
import { TranslateService } from '@ngx-translate/core';
import { LostProduct } from '@app/network/models/lostProduct.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hidePassword: boolean = true;
  loading: boolean = false;

  mainForm!: FormGroup;
  emailCtrl!: FormControl;
  passwordCtrl!: FormControl;
  loginInfoForm!: FormGroup;

  searchQuery: string = '';
  selectedLang = this.translate.currentLang || 'en';

  // Search field
  selectedBrand: string = '';
  serialNumberShort: string = '';

  // Select brand list avaiable 
  brands: string[] = ['JORDAN', 'Hermes', 'Louis Vuitton', 'PATEK PHILIPPE'];

  lostProducts = [
    {
      id: '1',
      serialNumber: 'A100235',
      serialNumberShort: 'Numéro: ...235',
      brand: 'JORDAN',
      model: 'JordanAIR 11 RETRO ',
      lossDate: '2025-10-10T00:00:00Z',
      lossCity: 'Paris',
      lossCountry: 'France',
      imageUrl: 'assets/images/jordan-retro.png',
    },
    {
      id: '2',
      serialNumber: 'B784523',
      serialNumberShort: 'Numéro: ...523',
      brand: 'Hermes',
      model: 'Sac Évelyne III 29',
      lossDate: '2025-10-15T00:00:00Z',
      lossCity: 'Lyon',
      lossCountry: 'France',
      imageUrl: 'assets/images/hermes-b.png',
    },
    {
      id: '3',
      serialNumber: 'C784987',
      serialNumberShort: 'Numéro: ...987',
      brand: 'Louis Vuitton',
      model: 'Sac Neverfull GM',
      lossDate: '2025-10-18T00:00:00Z',
      lossCity: 'Tokyo',
      lossCountry: 'Japan',
      imageUrl: 'assets/images/louisV-n.png',
    },
    {
      id: '4',
      serialNumber: 'P784549',
      serialNumberShort: 'Numéro: ...549',
      brand: 'PATEK PHILIPPE',
      model: 'MONTRE QUANTIÈME ANNUEL 5035R.',
      lossDate: '2025-10-25T00:00:00Z',
      lossCity: 'New York',
      lossCountry: 'USA',
      imageUrl: 'assets/images/patek-p.png',
    },
  ];

  filteredProducts = [...this.lostProducts];
  //filteredProducts: LostProduct[] = [];
  lostProductsP: LostProduct[] =  [];

  // Modal stolen goods
  selectedStolenProduct: any = null;
  showStolenModal: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.getPublicLostProduct();
  }

  private initFormControls(): void {
    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);
    this.passwordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(8)]);
    this.loginInfoForm = this.formBuilder.group({
      email: this.emailCtrl,
      password: this.passwordCtrl,
    });
  }

  private initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      loginInfo: this.loginInfoForm
    });
  }

  private getPublicLostProduct(): void {
    this.loginService.getAllPublicLostProduct().pipe(
      tap(
        publicLostProducts => {
          if(publicLostProducts) {
            this.lostProductsP = publicLostProducts;
            //this.filteredProducts = [...this.lostProductsP];
          }
        }
      )
    ).subscribe();
  }

  onSubmitForm() {
    if (!this.mainForm.valid) return;

    this.loading = true;
    const formValue = this.mainForm.value;
    const loginForm = {
      email: formValue['loginInfo'].email, 
      password: formValue['loginInfo'].password
    };

    this.loginService.logUser(loginForm).pipe(
      tap(data => {
        this.loading = false;
        if(data) {
          this.mainForm.reset();
          this.router.navigate(['/teik/news']);
        } else {
          console.error("Echec de connexion");
        }
      })
    ).subscribe();
  }

  getFormControlErrorTex(ctrl: AbstractControl) {
    if(ctrl.hasError('required')) return 'Ce champs est requis';
    if(ctrl.hasError('email')) return 'Merci d\'entrer une adresse mail valide';
    if(ctrl.hasError('minlength')) return 'Mot de passe incorrect ou moins de 8 caractères';
    return 'Ce champs contient une erreur';
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onStolenProductClick(product: any) {
    this.selectedStolenProduct = product;
    this.showStolenModal = true;
  }

  closeStolenModal() {
    this.showStolenModal = false;
    this.selectedStolenProduct = null;
  }

  get scanAlertIntro(): string {
    if (!this.selectedStolenProduct) return '';
    return this.translate.instant('LOGIN.SCAN_ALERT_INTRO') 
    + this.selectedStolenProduct.brand + ' ' + this.selectedStolenProduct.model;
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

    // Filtering by brand and serial number
  onSearchChange() {
    this.filteredProducts = this.lostProducts.filter(p =>
      (!this.selectedBrand || p.brand === this.selectedBrand) &&
      (!this.serialNumberShort || p.serialNumberShort?.includes(this.serialNumberShort))
    );
  }

  clearBrand() {
    this.selectedBrand = '';
    this.onSearchChange();
  }

  clearSerialNumber() {
    this.serialNumberShort = '';
    this.onSearchChange();
  }

}

