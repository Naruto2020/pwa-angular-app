import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkRoutingModule } from './network-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SquadComponent } from './components/squad/squad.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [SquadComponent],
  imports: [
    CommonModule,
    NetworkRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class NetworkModule { }
