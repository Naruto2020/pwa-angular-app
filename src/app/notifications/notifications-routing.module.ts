import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotifComponent } from './components/notif/notif.component';

const routes: Routes = [
  {path: '', component: NotifComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
