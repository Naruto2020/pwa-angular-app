import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, delay, Observable, of, throwError } from "rxjs";
import { LostProduct } from "../models/lostProduct.model";


@Injectable()
export class SquadService {
    constructor(private http: HttpClient) {}

    getAllPrivateLostProduct(): Observable<LostProduct[]> {
        return this.http.get<LostProduct[]>(`http://127.0.0.1:8002/teko/gateway-lost-products/private-lost-product`).pipe(
            // catchError(() => of().pipe(
            //     delay(1000)
            // ))

            catchError((error) => {
                console.error('Erreur getAllPublicLostProduct', error);
                return throwError(() => error);
            }) 
        );
    }
}
