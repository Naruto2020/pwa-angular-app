import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProductModule } from '../product/product.module';
import { SharedModule } from '../shared/shared.module';
import { NotifComponent } from './components/notif/notif.component';
import { NotificationsRoutingModule } from './notifications-routing.module';


@NgModule({
  declarations: [
    NotifComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NotificationsRoutingModule,
    ProductModule
  ]
})
export class NotificationsModule { }
