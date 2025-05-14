import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CockpitComponent } from './components/cockpit/cockpit.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    CockpitComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    HttpClientModule,
  ]
})
export class DashboardModule { }
