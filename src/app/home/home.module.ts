import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ScansModule } from '../scans/scans.module';
import { HomeRoutingModule } from './home-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ScansModule
  ]
})
export class HomeModule { }
