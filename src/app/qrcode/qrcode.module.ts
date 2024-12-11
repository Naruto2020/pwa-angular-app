import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QrcodeRoutingModule } from './qrcode-routing.module';
import { ProfileQrcodeComponent } from './components/profile-qrcode/profile-qrcode.component';


@NgModule({
  declarations: [
    ProfileQrcodeComponent
  ],
  imports: [
    CommonModule,
    QrcodeRoutingModule
  ]
})
export class QrcodeModule { }
