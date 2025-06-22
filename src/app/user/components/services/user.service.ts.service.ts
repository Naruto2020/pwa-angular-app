import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, of } from "rxjs";
import { Qrcode } from "../models/qrcode-model";
import { User } from "../models/user-model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://127.0.0.1:8002/teko/gateway-users/users').pipe(
      map((users: User[]) => users),
      catchError(() => of([])) 
    )
  }  

  getAllUsersCompanies(): Observable<User[]> {
    return this.http.get<User[]>('http://127.0.0.1:8002/teko/gateway-users/companies').pipe(
      map((users: User[]) => users),
      catchError(() => of([])) 
    )
  }  

  getCurrentUser(id: string): Observable<User | null> {
    return this.http.get<User>(`http://127.0.0.1:8002/teko/gateway-users/${id}`, { withCredentials: true }).pipe(
      map((user: User) => user),
      catchError(() => of(null))
    );
  }

  getUserById(id: string): Observable<User | null> {
    return this.http.get<User>(`http://127.0.0.1:8002/teko/gateway-users/unique/${id}`, { withCredentials: true }).pipe(
      map((user: User) => user),
      catchError(() => of(null))
    );
  }

  getOwnerProduct(ownerId: string) {
    
    return this.http.get<User>(`http://127.0.0.1:8002/teko/gateway-users/owner/${ownerId}`).pipe(
      map((user: User) => user),
      catchError(() => of(null))
    );
  }
  
  getOwnerQrcode(ownerId: string) {
    return this.http.get<Qrcode>(`http://127.0.0.1:8002/teko/gateway-qrcodes/current-user-qrcode/${ownerId}`).pipe(
      map((qrcode: Qrcode) => qrcode),
      catchError(() => of(null))
    );
  }
}
