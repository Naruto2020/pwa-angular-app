import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LostProduct } from "@app/network/models/lostProduct.model";
import { Observable, catchError, delay, map, of, tap, throwError } from "rxjs";

@Injectable()
export class LoginService {

    private tokenKey = "authToken";
    private userKeyFirstName = "authUserFirsName";
    private userKeyId = "authUserId";
    private userKeyLastName = "authUserLastName";
    private userKeyCompanie = "authUserCompanie";
    private userKeySecondHand = "authUserSecondHand";
    constructor(private http: HttpClient) {}

    logUser(formValue: object): Observable<boolean> {
        return this.http.post<{ token: string,  user: {userId: string, firstName: string, lastName: string, companie: string, secondHand: string, }}>('http://127.0.0.1:8002/teko/gateway/login', formValue).pipe(
            tap(data => {
                if(data && data.token) {
                    localStorage.setItem(this.tokenKey, data.token);
                    localStorage.setItem(this.userKeyFirstName, data.user.firstName);
                    localStorage.setItem(this.userKeyLastName, data.user.lastName);
                    localStorage.setItem(this.userKeyCompanie, data.user.companie);
                    localStorage.setItem(this.userKeySecondHand, data.user.secondHand);
                    localStorage.setItem(this.userKeyId, data.user.userId)
                }
            }),
            map(() => true),
            delay(1000), 
            catchError(() => of(false).pipe(
                delay(1000)
            ))
        );
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }
    getUserInfo(): { userId: string | null, firstName: string | null, lastName: string | null, companie: string | null, secondHand: string | null } {
        const userId = localStorage.getItem(this.userKeyId);
        const firstName = localStorage.getItem(this.userKeyFirstName);
        const lastName = localStorage.getItem(this.userKeyLastName);
        const companie = localStorage.getItem(this.userKeyCompanie);
        const secondHand = localStorage.getItem(this.userKeySecondHand);
        return {
            userId: userId,
            firstName: firstName, 
            lastName: lastName,
            companie: companie,
            secondHand: secondHand,
        }
    }

    getAllPublicLostProduct(): Observable<LostProduct[]> {
        return this.http.get<LostProduct[]>(`http://127.0.0.1:8002/teko/gateway-lost-products/public-lost-product`).pipe(
            // catchError(() => of().pipe(
            //     delay(1000)
            // ))

            catchError((error) => {
                console.error('Erreur getAllPublicLostProduct', error);
                return throwError(() => error);
            })
        );
    }

    logout(): void {
        localStorage.clear();
    }
}