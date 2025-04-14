import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { ProfileDropDownComponent } from './components/profile-drop-down/profile-drop-down.component';



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
