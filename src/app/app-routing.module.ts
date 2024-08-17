import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layout/default/default.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: "teik",
    component: DefaultComponent,
    children: [
      {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m =>m.AuthModule), data: {showHeader: false} },
      {path: 'news', loadChildren: () => import('./home/home.module').then(m =>m.HomeModule),  canActivate: [AuthGuard] },
      {path: 'mysquad', loadChildren: () => import('./home/home.module').then(m =>m.HomeModule), canActivate: [AuthGuard] },
      {path: 'notifications', loadChildren: () => import('./home/home.module').then(m =>m.HomeModule), canActivate: [AuthGuard] },
      {path: 'overviews', loadChildren: () => import('./home/home.module').then(m =>m.HomeModule), canActivate: [AuthGuard] },
      {path: 'user', loadChildren: () => import('./user/user.module').then(m =>m.UserModule), canActivate: [AuthGuard] },
      {path: 'product', loadChildren: () => import('./product/product.module').then(m =>m.ProductModule), canActivate: [AuthGuard] },
      {path: '**', redirectTo: 'auth/login' },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
