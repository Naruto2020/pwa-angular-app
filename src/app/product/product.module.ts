import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ProfileProductComponent } from './profile-product/profile-product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductService } from './services/product.service';

@NgModule({
  declarations: [
    ProfileProductComponent,
    CreateProductComponent
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
