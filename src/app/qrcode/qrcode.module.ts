import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../product/services/product.service';
import { SharedModule } from '../shared/shared.module';
import { ProfileQrcodeComponent } from './components/profile-qrcode/profile-qrcode.component';
import { QrcodeRoutingModule } from './qrcode-routing.module';
import { ProfileQrcodeService } from './services/profile-qrcode.service';


@NgModule({
  declarations: [
    ProfileQrcodeComponent
  ],
  imports: [
    CommonModule,
    QrcodeRoutingModule,
    SharedModule,
    HttpClientModule,
  ],
  providers: [
    ProfileQrcodeService,
    ProductService,
    
  ],
})
export class QrcodeModule { }
