import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { DefaultComponent } from './layout/default/default.component';

const routes: Routes = [
  {
    path: 'teik/auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  {
    path: "teik",
    component: DefaultComponent,
    children: [
      {path: 'news', loadChildren: () => import('./home/home.module').then(m =>m.HomeModule),  canActivate: [AuthGuard] },
      {path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m =>m.NotificationsModule), canActivate: [AuthGuard] },
      {path: 'activity', loadChildren: () => import('./posts/posts.module').then(m =>m.PostsModule), canActivate: [AuthGuard] },
      {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m =>m.DashboardModule), canActivate: [AuthGuard] },
      {path: 'mysquad', loadChildren: () => import('./network/network.module').then(m =>m.NetworkModule), canActivate: [AuthGuard] },
      {path: 'user', loadChildren: () => import('./user/user.module').then(m =>m.UserModule), canActivate: [AuthGuard] },
      {path: 'products', loadChildren: () => import('./product/product.module').then(m =>m.ProductModule), canActivate: [AuthGuard] },
      { path: 'qrcodes', loadChildren: ()=> import('./qrcode/qrcode.module').then(m =>m.QrcodeModule), canActivate: [AuthGuard]},
      {path: '**', redirectTo: '/teik/auth/login' },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
