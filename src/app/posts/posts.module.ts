import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { ProfilePostComponent } from './components/profile-post/profile-post.component';


@NgModule({
  declarations: [
    CreatePostComponent,
    ProfilePostComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule
  ]
})
export class PostsModule { }
