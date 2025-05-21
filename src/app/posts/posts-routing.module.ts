import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { ProfilePostComponent } from './components/profile-post/profile-post.component';

const routes: Routes = [
  {path: 'create', component: CreatePostComponent},
  {path: 'profile-post', component: ProfilePostComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
