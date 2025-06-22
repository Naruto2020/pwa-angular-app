import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { ScanUserComponent } from './components/scan-user/scan-user.component';

const routes: Routes = [
  {path: 'current-user/:id', component: ProfileComponent},
  {path: 'scan-user/:id', component: ScanUserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
