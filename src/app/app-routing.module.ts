import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layout/default/default.component';

const routes: Routes = [
  {
    path: "teik",
    component: DefaultComponent,
    children: [
      {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m =>m.AuthModule), data: {showHeader: false} },
      {path: 'news', loadChildren: () => import('./home/home.module').then(m =>m.HomeModule)},
      {path: 'mysquad', loadChildren: () => import('./home/home.module').then(m =>m.HomeModule)},
      {path: 'notifications', loadChildren: () => import('./home/home.module').then(m =>m.HomeModule)},
      {path: 'overviews', loadChildren: () => import('./home/home.module').then(m =>m.HomeModule)},
      {path: 'user', loadChildren: () => import('./user/user.module').then(m =>m.UserModule)},
      {path: '**', redirectTo: 'auth' },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
