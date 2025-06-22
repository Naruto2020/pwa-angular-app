import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, of } from "rxjs";
import { Qrcode } from "../../user/components/models/qrcode-model";

@Injectable({
    providedIn: 'root'
}) 
export class ProfileQrcodeService {

    constructor(private http: HttpClient) { }
    
    getCompanyOwnerQrcode(ownerId: string) {
        return this.http.get<Qrcode[]>(`http://127.0.0.1:8002/teko/gateway-qrcodes/current-company-qrcode/${ownerId}`).pipe(
            map((qrcode: Qrcode[]) => qrcode),
            catchError(() => of([]))
        );
    }

    getQrcodeByProductAndCompany(productId: string, companieId: string) {
        return this.http.get<any>(`http://127.0.0.1:8002/teko/gateway-qrcodes/qrcodes?productId=${productId}&companieId=${companieId}`).pipe(
            map((qrcode: Qrcode | null) => qrcode),
            catchError(() => of([]))
        );
    }
}