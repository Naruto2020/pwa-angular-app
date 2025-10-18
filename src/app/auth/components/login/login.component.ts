import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

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

  lostProducts = [
    {
      id: 1,
      serialNumber: 'A100235',
      shortSerial: 'Numéro: ...235',
      brand: 'JORDAN',
      model: 'JordanAIR 11 RETRO ',
      lossDate: '2025-10-10T00:00:00Z',
      lossCity: 'Paris',
      lossCountry: 'France',
      imageUrl: 'assets/images/jordan-retro.png',
    },
    {
      id: 2,
      serialNumber: 'B784523',
      shortSerial: 'Numéro: ...523',
      brand: 'Hermes',
      model: 'Sac Évelyne III 29',
      lossDate: '2025-10-15T00:00:00Z',
      lossCity: 'Lyon',
      lossCountry: 'France',
      imageUrl: 'assets/images/hermes-b.png',
    },
    {
      id: 3,
      serialNumber: 'C784987',
      shortSerial: 'Numéro: ...987',
      brand: 'Louis Vuitton',
      model: 'Sac Neverfull GM',
      lossDate: '2025-10-18T00:00:00Z',
      lossCity: 'Tokyo',
      lossCountry: 'Japan',
      imageUrl: 'assets/images/louisV-n.png',
    },

    {
      id: 4,
      serialNumber: 'P784549',
      shortSerial: 'Numéro: ...549',
      brand: 'PATEK PHILIPPE',
      model: 'MONTRE QUANTIÈME ANNUEL 5035R.',
      lossDate: '2025-10-25T00:00:00Z',
      lossCity: 'New York',
      lossCountry: 'USA',
      imageUrl: 'assets/images/patek-p.png',
    },
  ];



  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
  }

  private initFormControls(): void {
    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);
    this.passwordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(8)]);
    this.loginInfoForm = this.formBuilder.group({
      email: this.emailCtrl,
      password: this.passwordCtrl,
    })

  }

  private initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      loginInfo: this.loginInfoForm
    });
  }

  onSubmitForm(){
    this.loading = true;
    const formValue = this.mainForm.value;
    const loginForm = {
      email: formValue['loginInfo'].email, 
      password: formValue['loginInfo'].password
    }

    this.loginService.logUser(loginForm).pipe(
      tap(data => {
        this.loading = false;
        if(data) {
          this.mainForm.reset();
          this.router.navigate(['/teik/news']);
        }else {
          console.error("Echec");
        }
      }) 
    ).subscribe();

  }


  getFormControlErrorTex(ctrl: AbstractControl) {
    if(ctrl.hasError('required')) {
      return 'Ce champs est requis';
    }else if(ctrl.hasError('email')) {
      return 'Merci d\'entrer une adresse mail valide';
    }else if(ctrl.hasError('minlength')) {
      return 'mot de passe incorrecte Ou contient moins de 8 carractères'
    }
    else{
      return " Ce Champs contien une érreur";
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSearchChange() {
    console.log('Recherche :', this.searchQuery);
    // 👉 tu pourras ici appeler un service pour filtrer les résultats
  }

  clearSearch() {
    this.searchQuery = '';
  }
  
}
