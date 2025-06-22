import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class TransferUrlService {
    userUrlScanned!: string;

    constructor() {}

    catchUserUrlScanned(url: string): void {
        if (url) {
            localStorage.setItem('scannedUserUrl', url);
        } else {
            console.error('No URL provided');
        }
    }

    catchProductUrlScanned(urls: string[]): void {
        if (urls && urls.length > 0) {
            localStorage.setItem('scannedProductUrl', JSON.stringify(urls));
        } else {
            console.error('No URL provided');
        }
    }

    getScannedUserId(): string {
        const scannedUrl = localStorage.getItem('scannedUserUrl');
        if (!scannedUrl) return  '';
        const urlParts = (scannedUrl.split('/')[scannedUrl.split('/').length - 1]);
        
        return urlParts; // récupère l'ID
    }

    getScannedProductId(): string[] {
        const urlParts:string[] = [];
        const scannedUrl = localStorage.getItem('scannedProductUrl');
        if (!scannedUrl) return  [];
        const tableUrls = JSON.parse(scannedUrl);
        if (tableUrls.length === 0) return [];
        tableUrls.forEach((url: string) => {
            urlParts.push(url.split('/')[url.split('/').length - 1]);
        })
        return urlParts;
    }

}