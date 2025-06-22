import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private http: HttpClient) { }

  uploadImage(apiUrl: string, resourceId: string, formData: any): Observable<any> {
    return this.http.patch(`${apiUrl}/${resourceId}`, formData, {
      reportProgress: true,
      observe: 'events'
    });

  }
}
