import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { CurrentProductComponent } from './components/current-product/current-product.component';
import { ProfileProductComponent } from './components/profile-product/profile-product.component';
import { ProductRoutingModule } from './product-routing.module';
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
