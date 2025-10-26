import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoginService } from '../auth/components/services/login.service';
import { PostsService } from '../posts/services/posts.service';
import { ProductService } from '../product/services/product.service';
import { SharedModule } from '../shared/shared.module';
import { UserService } from '../user/components/services/user.service.ts.service';
import { QrcodeScanComponent } from './components/qrcode-scan/qrcode-scan.component';
import { ScanAlertComponent } from './components/scan-alert/scan-alert.component';
import { ScanShareComponent } from './components/scan-share/scan-share.component';
import { ScansRoutingModule } from './scans-routing.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    QrcodeScanComponent,
    ScanAlertComponent,
    ScanShareComponent
  ],
  imports: [
    CommonModule,
    ScansRoutingModule,
    SharedModule,
    TranslateModule,
  ],
  exports: [
    QrcodeScanComponent,
    ScanShareComponent,
    ScanAlertComponent,
  ],
  providers: [
    PostsService,
    LoginService,
    UserService,
    ProductService,
  ]
})
export class ScansModule { }
