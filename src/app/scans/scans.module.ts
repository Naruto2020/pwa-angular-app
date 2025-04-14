import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { QrcodeScanComponent } from './components/qrcode-scan/qrcode-scan.component';
import { ScansRoutingModule } from './scans-routing.module';


@NgModule({
  declarations: [
    QrcodeScanComponent
  ],
  imports: [
    CommonModule,
    ScansRoutingModule,
    SharedModule
  ],
  exports: [
    QrcodeScanComponent 
  ]
})
export class ScansModule { }
