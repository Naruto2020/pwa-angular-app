import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileProductComponent } from './profile-product/profile-product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { CurrentProductComponent } from './current-product/current-product.component';

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
