import { SafeUrl } from "@angular/platform-browser";

export interface newSignal {
    userName: string;
    productName: string;
    fakeUrl: string;
    userImageUrl: SafeUrl;
    imageUrl: SafeUrl;
    date: string;
    city: string;
    storeName: string;
    description: string;  
}