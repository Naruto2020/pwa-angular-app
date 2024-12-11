import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, delay, catchError, of } from "rxjs";
import { User } from "../models/user-model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getCurrentUser(id: string): Observable<User | null> {
    return this.http.get<User>(`http://127.0.0.1:8002/teko/gateway-users/${id}`, { withCredentials: true }).pipe(
      map((user: User) => user),
      catchError(() => of(null))
      // map(() => true),
      // delay(1000),
      // catchError(() => of(false).pipe(
      //   delay(1000)
      // ))
    );
  }

  getOwnerProduct(ownerId: string) {
    
    return this.http.get<User>(`http://127.0.0.1:8002/teko/gateway-users/owner/${ownerId}`).pipe(
      map((user: User) => user),
      catchError(() => of(null))
    );
  }
}
