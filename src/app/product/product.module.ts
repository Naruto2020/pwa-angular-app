import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { CreateProductComponent } from './create-product/create-product.component';
import { CurrentProductComponent } from './current-product/current-product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProfileProductComponent } from './profile-product/profile-product.component';
import { ProductService } from './services/product.service';

@NgModule({
  declarations: [
    ProfileProductComponent,
    CreateProductComponent,
    CurrentProductComponent,
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
