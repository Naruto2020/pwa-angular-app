import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostFormValue } from '../../models/post-form-value';
import { PostSignal } from '../../models/post-model';

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
  currentProductId : string = "123test"; // Initialize with a default value


  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.initFormControls();
    this.initPostForm();
  }
  private initFormControls() {
    this.primaryPostInfoForm = this.formBuilder.group({
      author: ['', Validators.required],
      fakeUrl: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.secondaryPostInfoForm = this.formBuilder.group({
      storeName: ['', Validators.required],
      productName: ['', Validators.required],
      city: ['', Validators.required],
      //postImage: [''], // Uncomment if you want to include postImage
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
      // newPostSignal.postImage = postFormValue["secondaryPostInfo"].postImage; // Uncomment if you want to include postImage
    } else {
      console.error('Form is invalid');
    }
  }

}
