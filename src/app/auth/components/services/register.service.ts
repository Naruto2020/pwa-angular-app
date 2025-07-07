import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, delay, map, of } from "rxjs";
import { User } from "../models/user-model";

@Injectable()
export class RegisterService {
    constructor(private http: HttpClient) {}

    saveUserInfo(formValue: User): Observable<boolean> {
        console.log('formValue ===> : ', formValue)
        return this.http.post('http://127.0.0.1:8002/teko/gateway/authservice', formValue).pipe(
            map(() => true),
            delay(1000),
            catchError(() => of(false).pipe(
                delay(1000)
            ))
        );
    }
}