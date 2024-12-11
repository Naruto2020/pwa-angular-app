import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ProfileProductComponent } from './profile-product/profile-product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductService } from './services/product.service';
import { CurrentProductComponent } from './current-product/current-product.component';

@NgModule({
  declarations: [
    ProfileProductComponent,
    CreateProductComponent,
    CurrentProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    HttpClientModule,
  ],
  providers: [
    ProductService
  ],
})
export class ProductModule { }
