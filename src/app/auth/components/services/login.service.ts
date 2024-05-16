import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, delay, map, of } from "rxjs";
import { LoginFormValue } from "../models/login-form-value";

@Injectable()
export class LoginService {
    constructor(private http: HttpClient) {}

    logUser(formValue: object): Observable<boolean> {
        return this.http.post('http://127.0.0.1:8002/teko/gateway/login', formValue).pipe(
            map(() => true),
            delay(2000), 
            catchError(() => of(false).pipe(
                delay(2000)
            ))
        );
    }
}