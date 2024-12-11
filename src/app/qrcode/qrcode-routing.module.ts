import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileQrcodeComponent } from './components/profile-qrcode/profile-qrcode.component';

const routes: Routes = [
  {path: 'profile-qrcode', component: ProfileQrcodeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrcodeRoutingModule { }
