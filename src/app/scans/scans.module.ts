import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { QrcodeScanComponent } from './components/qrcode-scan/qrcode-scan.component';
import { ScansRoutingModule } from './scans-routing.module';
import { ScanAlertComponent } from './components/scan-alert/scan-alert.component';


@NgModule({
  declarations: [
    QrcodeScanComponent,
    ScanAlertComponent
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
