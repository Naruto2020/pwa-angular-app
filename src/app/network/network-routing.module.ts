import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SquadComponent } from './components/squad/squad.component';

const routes: Routes = [
  {path: '', component: SquadComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkRoutingModule { }
