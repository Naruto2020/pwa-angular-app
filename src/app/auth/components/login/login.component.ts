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
  
}
