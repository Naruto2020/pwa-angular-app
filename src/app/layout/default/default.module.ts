import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthModule } from 'src/app/auth/auth.module';
import { HomeModule } from 'src/app/home/home.module';
import { CoreModule } from '../../core/core.module';
import { HomepageComponent } from '../../home/components/homepage/homepage.component';
import { ScansModule } from '../../scans/scans.module';
import { DefaultComponent } from './default.component';



@NgModule({
  declarations: [
    DefaultComponent,
    HomepageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CoreModule,
    HomeModule,
    AuthModule,
    ScansModule,
  ],
})
export class DefaultModule { }
