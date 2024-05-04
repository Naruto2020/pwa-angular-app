import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { CoreModule } from '../../core/core.module';
import { RouterModule } from '@angular/router';
import { HomepageComponent } from '../../home/components/homepage/homepage.component';
import { HomeModule } from 'src/app/home/home.module';
import { AuthModule } from 'src/app/auth/auth.module';
import { LoginComponent } from 'src/app/auth/components/login/login.component';



@NgModule({
  declarations: [
    DefaultComponent,
    HomepageComponent,
    //LoginComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CoreModule,
    HomeModule,
    AuthModule
  ],
})
export class DefaultModule { }
