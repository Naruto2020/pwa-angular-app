import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  mainForm!: FormGroup;
  emailCtrl!: FormControl;
  passwordCtrl!: FormControl;
  loginInfoForm!: FormGroup;


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
  }

  private initFormControls(): void {
    this.emailCtrl = this.formBuilder.control('', Validators.required);
    this.passwordCtrl = this.formBuilder.control('', Validators.required);
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

  }




  // getErrorMessage(control: FormControl) {
  //   return control.hasError('required') ? 'You must enter a value' :
  //          control.hasError('email') ? 'Not a valid email' :
  //          '';
  // }
}
