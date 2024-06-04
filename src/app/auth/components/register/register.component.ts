import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { RegisterService } from '../services/register.service';
import { User } from '../models/user-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  hidePassword: boolean = true;
  
  loading = false;
  mainForm!: FormGroup;
  personalInfoForm!: FormGroup;
  firstNameCtrl!: FormControl;
  userCompanieStatusCtrl!: FormControl;
  YesCtrl!: FormControl;
  userRegionForm!: FormGroup;
  phoneCtrl!: FormControl;
  emailCtrl!: FormControl;
  passwordCtrl!: FormControl;
  loginInfoForm!: FormGroup;

  // showYesCtrl$!: Observable<boolean>;
  // showNoCtrl$!: Observable<boolean>;


  phoneNumberValidator(control: FormControl): { [key: string]: any } | null {
    const phoneNumberPattern = /^\d+$/; // Changer cela selon le besoin
    const isValid = phoneNumberPattern.test(control.value);
    return isValid ? null : { 'invalidPhoneNumber': { value: control.value } };
  }

  constructor(private formBuilder: FormBuilder, private registerService: RegisterService, private router: Router) { }

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    //this.initFormObservable();
  }

  private initFormControls() {
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    this.userCompanieStatusCtrl = this.formBuilder.control('non');
    this.YesCtrl = this.formBuilder.control('');
    this.userRegionForm = this.formBuilder.group({
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
    this.phoneCtrl = this.formBuilder.control('', [Validators.required, this.phoneNumberValidator]);
    this.emailCtrl = this.formBuilder.control('', [Validators.required, Validators.email]);
    this.passwordCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(8)]);
    this.loginInfoForm = this.formBuilder.group({
      email: this.emailCtrl,
      password: this.passwordCtrl,
    });
  }

  private initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      companie: this.userCompanieStatusCtrl,
      Yes: this.YesCtrl,
      userRegion: this.userRegionForm,
      phone: this.phoneCtrl,
      loginInfo: this.loginInfoForm
    });
  }

  onSubmitForm(){
    this.loading = true;
    const formValue = this.mainForm.value
    const newUser = new User()
    newUser.firstName = formValue["personalInfo"].firstName;
    newUser.lastName = formValue["personalInfo"].lastName;
    newUser.companie = formValue["companie"];
    newUser.city = formValue["userRegion"].city;
    newUser.country = formValue["userRegion"].country;
    newUser.phoneNumber = formValue["phone"];
    newUser.email = formValue["loginInfo"].email;
    newUser.password = formValue["loginInfo"].password;

    this.registerService.saveUserInfo(newUser).pipe(
      tap(data => {
        this.loading = false
        if(data) {
          this.mainForm.reset();
          this.userCompanieStatusCtrl.patchValue('non');
          this.router.navigate(['/login']);
        } else {
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
    }else if(ctrl.hasError('invalidPhoneNumber')){
      return 'Merci d\'entrer un numéro valide'
    }
    else{
      return " Ce Champs contien une érreur";
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
