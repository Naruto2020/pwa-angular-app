import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '@app/product/services/product.service';
import { ScansModule } from '../scans/scans.module';
import { TransferUrlService } from '../services/transferUrl.service';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';
import { ScanUserComponent } from './components/scan-user/scan-user.component';
import { UserService } from './components/services/user.service.ts.service';
import { UserRoutingModule } from './user-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    ProfileComponent,
    ScanUserComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    HttpClientModule,
    ScansModule,
    TranslateModule,
  ],
  exports: [
    ScanUserComponent,
  ],
  providers: [
    UserService,
    ProductService,
    TransferUrlService,
  ]
})
export class UserModule { }
