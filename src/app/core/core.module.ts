import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ProfileDropDownComponent } from './components/profile-drop-down/profile-drop-down.component';
import {MatCardModule} from '@angular/material/card';



@NgModule({
  declarations: [
    HeaderComponent,
    ProfileDropDownComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    SharedModule,
  ],
  exports: [
    HeaderComponent,
    ProfileDropDownComponent
  ]
})
export class CoreModule { }
