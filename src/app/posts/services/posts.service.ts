import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, delay, map, Observable, of } from "rxjs";
import { PostSignal } from "../models/post-model";

@Injectable()
export class PostsService {
    constructor(private http: HttpClient) {}

    createPostSignal(formValue: PostSignal): Observable<PostSignal | null> {
        return this.http.post<PostSignal>('http://127.0.0.1:8002/teko/gateway-posts/posts', formValue).pipe(
            delay(1000), 
            map(response => response), 
            catchError(() => of(null).pipe(
            delay(1000) 
            ))
        );
    }  
    
    getPosts(): Observable<PostSignal[]> {
        return this.http.get<PostSignal[]>('http://127.0.0.1:8002/teko/gateway-posts').pipe(
            delay(1000),
            map(response => response),
            catchError(() => of([]).pipe(
            delay(1000)
            ))
        )
    }    
}