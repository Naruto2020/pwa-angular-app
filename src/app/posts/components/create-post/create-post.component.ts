import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { User } from '../../../auth/components/models/user-model';
import { LoginService } from '../../../auth/components/services/login.service';
import { UserService } from '../../../user/components/services/user.service.ts.service';
import { PostFormValue } from '../../models/post-form-value';
import { PostSignal } from '../../models/post-model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  loading = false;
  postForm!: FormGroup; 
  primaryPostInfoForm!: FormGroup; 
  secondaryPostInfoForm!: FormGroup; 
  postSignal!: PostSignal; 
  currentPostId!: string; 
  currentUserId: string = this.loginService.getUserInfo().userId ?? "defaultUserId"; // Get the current user ID from the login service
  scannedUrl: string  = ""; 
  showUserField = false; 
  companies: User[] = []; 


  constructor(
    private formBuilder: FormBuilder, 
    private postsService : PostsService,
    private router: Router,
    private loginService: LoginService,
    private userService: UserService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.scannedUrl = nav?.extras?.state?.['fakeUrl'] ?? '';
  }

  ngOnInit(): void {
    this.initCompaniesUsers();
    this.initFormControls();
    this.initPostForm();

  }

  private initCompaniesUsers() {
    this.userService.getAllUsersCompanies().pipe(
      tap((companiesUsers: User[]) => {
        this.companies = companiesUsers;
      })
    ).subscribe();
  }

  private initFormControls() {
    this.primaryPostInfoForm = this.formBuilder.group({
      author: [this.currentUserId, Validators.required],
      fakeUrl: [this.scannedUrl, Validators.required],
      description: ['', Validators.required],
    });
    this.secondaryPostInfoForm = this.formBuilder.group({
      storeName: ['', Validators.required],
      productName: ['', Validators.required],
      city: ['', Validators.required],
    });
  }
  
  private initPostForm() {
    this.postForm = this.formBuilder.group({
      primaryPostInfo: this.primaryPostInfoForm,
      secondaryPostInfo: this.secondaryPostInfoForm,
    });
  }

  onSubmitForm() {
    if (this.postForm.valid) {
      this.loading = true;
      const postFormValue: PostFormValue = this.postForm.value;
      const newPostSignal = new PostSignal();
      newPostSignal.author = postFormValue["primaryPostInfo"].author;
      newPostSignal.fakeUrl = postFormValue["primaryPostInfo"].fakeUrl;
      newPostSignal.description = postFormValue["primaryPostInfo"].description;
      newPostSignal.storeName = postFormValue["secondaryPostInfo"].storeName;
      newPostSignal.productName = postFormValue["secondaryPostInfo"].productName;
      newPostSignal.city = postFormValue["secondaryPostInfo"].city;
      newPostSignal.description = postFormValue["primaryPostInfo"].description;

      this.postsService.createPostSignal(newPostSignal).pipe(
        tap(data => {
          this.loading = false;
          if (data) {
            const postId = data._id;
            if(!postId) return 
            
            this.currentPostId = postId;
            this.postForm.reset();
            
          } else {
            console.error('Failed to create post');
          }
        })
      ).subscribe()
    } else {
      console.error('Form is invalid');
    }

  }
  onImageUploaded(): void {
    this.initCompaniesUsers();
  }

}
