import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageUploadService } from '../../services/image-upload.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @Input() apiUrl!: string;
  @Input() resourceId!: string;
  @Input() fileType: 'profilePhoto' | 'productPhoto' = 'productPhoto';

  uploadForm!: FormGroup;
  seletedFile: File | null = null;

  constructor(private fb: FormBuilder, private imageUploadService: ImageUploadService) {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
      fileType: [this.fileType, Validators.required],
    });
   }

  ngOnInit(): void {
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.seletedFile = input.files[0];
      this.uploadForm.patchValue({
        file: this.seletedFile, 
        fileType: this.fileType
      });
      this.uploadForm.get('file')?.updateValueAndValidity();  
    }
  }

  onSubmit(): void {

    if(!this.seletedFile) return;
    const formData = new FormData();
    formData.append('file', this.seletedFile);
    formData.append('fileType', this.fileType);

    this.imageUploadService.uploadImage(this.apiUrl, this.resourceId, formData).subscribe(
    );
  }

}
