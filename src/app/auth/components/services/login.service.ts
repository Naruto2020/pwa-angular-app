import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoginFormValue } from "../models/login-form-value";

@Injectable()
export class LoginService {
    constructor(private http: HttpClient) {}

    logUser(data: LoginFormValue): Observable<object> {
        return this.http.post('loginUrl', data)
    }
}