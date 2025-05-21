import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { CurrentProductComponent } from './components/current-product/current-product.component';
import { ProfileProductComponent } from './components/profile-product/profile-product.component';

const routes: Routes = [
  {path: 'create', component: CreateProductComponent},
  {path: 'profile-product', component: ProfileProductComponent},
  {path: 'current-product/:id', component: CurrentProductComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
