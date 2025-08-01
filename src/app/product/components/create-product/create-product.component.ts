import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginService } from '../../../auth/components/services/login.service';
import { ProductFormValue } from '../../models/product-form-value';
import { Product } from '../../models/product-model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {

  loading = false;
  showOwnerField = false; 
  productForm!: FormGroup;
  primaryProductInfoForm!: FormGroup;
  secondaryProductInfoForm!: FormGroup;
  product!: Product;

  productTypeCtrl!: FormControl;
  productStatusCtrl!: FormControl;
  YesCtrl!: FormControl;
  quantityCtrl!: FormControl;


  constructor(private formBuilder: FormBuilder, private router: Router, 
    private loginService: LoginService, private productService: ProductService) { }

  ngOnInit(): void {
    this.initFormControls();
    this.initProductForm();
  }

  private initFormControls() {
    const userInfos = this.loginService.getUserInfo();
    const currentCompanieName1 = `${userInfos.lastName} ${userInfos.firstName}`
    const currentCompanieId = this.loginService.getUserInfo().userId;
  
    this.primaryProductInfoForm = this.formBuilder.group({
      name: ['', Validators.required],
      serialNumber: ['', [ Validators.pattern('^[0-9]{2,}$')]],
      companieName: currentCompanieName1,
      city: ['', Validators.required],
      companieId: currentCompanieId,
    });
    this.productTypeCtrl = this.formBuilder.control('non');
    this.productStatusCtrl = this.formBuilder.control('non');
    this.YesCtrl = this.formBuilder.control('');
    this.secondaryProductInfoForm = this.formBuilder.group({
      owner: currentCompanieId,
      expiryDate: ['', Validators.required],
      productPhoto: [''],
      usedBy: [''],
    });
    this.quantityCtrl = this.formBuilder.control(null, [Validators.required, Validators.min(1)])
  }

  private initProductForm() {
    this.productForm = this.formBuilder.group({
      primaryProductInfo: this.primaryProductInfoForm,
      isFashion: this.productTypeCtrl,
      isAlreadyUse: this.productStatusCtrl,
      Yes: this.YesCtrl,
      secondaryProductInfo: this.secondaryProductInfoForm,
      quantity: this.quantityCtrl
    });
  }

  onSubmitForm() {
    this.loading = true;
    const formValue: ProductFormValue = this.productForm.value;
    const newProduct = new Product();

    newProduct.name = formValue["primaryProductInfo"].name;
    newProduct.serialNumber = formValue["primaryProductInfo"].serialNumber || '';
    newProduct.companieName = formValue["primaryProductInfo"].companieName;
    newProduct.city = formValue["primaryProductInfo"].city;
    newProduct.companieId = formValue["primaryProductInfo"].companieId;
    newProduct.isFashion = formValue["isFashion"];
    newProduct.isAlreadyUse = formValue["isAlreadyUse"];
    newProduct.owner = [formValue["secondaryProductInfo"].owner];
    newProduct.expiryDate = formValue["secondaryProductInfo"].expiryDate;
    newProduct.productPhoto = formValue["secondaryProductInfo"].productPhoto;
    newProduct.usedBy = formValue["secondaryProductInfo"].usedBy;
    newProduct.quantity = formValue["quantity"];

    this.productService.createProduct(newProduct).pipe(
      tap(data => {
        this.loading = false;
        if(data) {
          this.productForm.reset();
          this.productTypeCtrl.patchValue('non');
          this.productStatusCtrl.patchValue('non');
        }
      })
    ).subscribe();
  }

}
