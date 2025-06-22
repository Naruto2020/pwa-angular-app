import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { ProfilePostComponent } from './components/profile-post/profile-post.component';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsService } from './services/posts.service';


@NgModule({
  declarations: [
    CreatePostComponent,
    ProfilePostComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    SharedModule,
    HttpClientModule,
  ],
  providers: [
    PostsService, 
  ]
})
export class PostsModule { }
