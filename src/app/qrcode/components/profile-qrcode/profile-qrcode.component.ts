// import { Component, OnInit } from '@angular/core';
// import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// import { forkJoin, tap } from 'rxjs';
// import { LoginService } from '../../../auth/components/services/login.service';
// import { Product } from '../../../product/models/product-model';
// import { ProductService } from '../../../product/services/product.service';
// import { ProfileQrcodeService } from '../../services/profile-qrcode.service';
// //import { Qrcode } from '../../../user/components/models/qrcode-model';

// interface Qrcode {
//   productName?: string;
//   _id?: string;
//   imageDataUrl?: string;
// }

// interface QrcodeCount {
//   name: string;
//   id: string;
//   count: number;
//   imageUrl: SafeUrl;
// }

// @Component({
//   selector: 'app-profile-qrcode',
//   templateUrl: './profile-qrcode.component.html',
//   styleUrls: ['./profile-qrcode.component.scss']
// })
// export class ProfileQrcodeComponent implements OnInit {

//   currentUserId!: string;
//   companyQrcodeUrl!: string;
//   currentUserCompanie!: string;
//   currentUserFirstName!: string;
//   userProducts!: Product[]
//   userQrcodes!: Qrcode[] ;
//   uniqueDataByName!: Qrcode[]
//   countOfQrcodes: QrcodeCount[] = [];
//   uniqueQrcodes: QrcodeCount[] = [];
//   companyProducts!: any[];

//   constructor(
//     private profileQrcodeService: ProfileQrcodeService,
//     private loginService: LoginService,
//     private productService: ProductService,
//     private sanitizer: DomSanitizer,
//   ) { }

//   ngOnInit(): void {
//     const userInfo = this.loginService.getUserInfo();
//     if (!userInfo?.userId || !userInfo?.firstName || !userInfo?.companie) return;
  
//     this.currentUserId = userInfo.userId;
//     this.currentUserFirstName = userInfo.firstName;
//     this.currentUserCompanie = userInfo.companie ;


//     this.profileQrcodeService.getCompanyOwnerQrcode(this.currentUserId).pipe(
//       tap(data => {
//         console.log('Company Owner QR Codes:', data);
//         this.productService.getAllProducts().pipe(
//           tap(products => {
//             if (products) {
//               const filteredProducts = data.filter(d => products.filter(p => p.owner?.slice(-1)[0] === d.companieId && p._id === d.productId).length > 0);
//               this.companyProducts = filteredProducts
//             }
//           })    
//         ).subscribe();  

//         if (Array.isArray(this.companyProducts)) {
//           console.log('Company Products:', this.companyProducts);
//           this.uniqueDataByName =  Array.from(
//             new Map(this.companyProducts.map(q => [q.productName, q])).values()
//           );
//           this.countOfQrcodes = this.uniqueDataByName.map(qrcode => ({
//             name: qrcode.productName || '',
//             id: qrcode._id || '',
//             count: data.filter(q => q.productName === qrcode.productName).length,
//             imageUrl: this.sanitizer.bypassSecurityTrustUrl(qrcode.imageDataUrl || '')
//           }));
//         }}),
//     ).subscribe()

//     this.productService.getAllProducts().pipe(
//       tap(products => {
//         if (products) {
//           this.userProducts = products.filter(p => p.owner?.slice(-1)[0] === this.currentUserId);

//           // retrieve associate QR codes for each product
//           const qrcodeObservables = this.userProducts
//             .filter(p => p._id && p.companieId)
//             .map(product => {
//               const res =  this.profileQrcodeService.getQrcodeByProductAndCompany(
//                 product._id!, product.companieId!
//               )

//               return res;
//             });

//           forkJoin<any>(qrcodeObservables).subscribe((qrcodes: any) => {

//             const filtered = qrcodes.filter((q: any): q is Qrcode => q !== null);
//             this.userQrcodes = filtered;
//             this.uniqueQrcodes = Array.from(new Map(this.userQrcodes.map(q => [q.productName, q])).values())
//             .map(qrcode => ({
//               name: qrcode.productName || '',
//               id: qrcode._id || '',
//               count: 1, // Default count to 1 for each unique QR code
//               imageUrl: this.sanitizer.bypassSecurityTrustUrl(qrcode.imageDataUrl || '')
//             }));
//           });
//         }
//       }),
//     ).subscribe();
//   }

// }

import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { LoginService } from '../../../auth/components/services/login.service';
import { Product } from '../../../product/models/product-model';
import { ProductService } from '../../../product/services/product.service';
import { ProfileQrcodeService } from '../../services/profile-qrcode.service';

interface Qrcode {
  productName?: string;
  _id?: string;
  imageDataUrl?: string;
  productId?: string;
  companieId?: string;
}

interface QrcodeCount {
  name: string;
  id: string;
  count: number;
  imageUrl: SafeUrl;
}

@Component({
  selector: 'app-profile-qrcode',
  templateUrl: './profile-qrcode.component.html',
  styleUrls: ['./profile-qrcode.component.scss']
})
export class ProfileQrcodeComponent implements OnInit {

  currentUserId!: string;
  companyQrcodeUrl!: string;
  currentUserCompanie!: string;
  currentUserFirstName!: string;

  userProducts: Product[] = [];
  userQrcodes: Qrcode[] = [];
  uniqueDataByName: Qrcode[] = [];
  countOfQrcodes: QrcodeCount[] = [];
  uniqueQrcodes: QrcodeCount[] = [];
  companyProducts: Qrcode[] = [];

  constructor(
    private profileQrcodeService: ProfileQrcodeService,
    private loginService: LoginService,
    private productService: ProductService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    const userInfo = this.loginService.getUserInfo();
    if (!userInfo?.userId || !userInfo?.firstName || !userInfo?.companie) return;

    this.currentUserId = userInfo.userId;
    this.currentUserFirstName = userInfo.firstName;
    this.currentUserCompanie = userInfo.companie;

    /**
     * QR codes for company-owned products
     */
    forkJoin({
      qrcodes: this.profileQrcodeService.getCompanyOwnerQrcode(this.currentUserId),
      products: this.productService.getAllProducts()
    }).subscribe(({ qrcodes, products }) => {
      this.companyProducts = qrcodes.filter(qr => {
        const product = products.find(p => p._id === qr.productId);
        if (!product || !Array.isArray(product.owner) || product.owner.length === 0) return false;

        const lastOwnerId = product.owner[product.owner.length - 1];
        return (
          qr.productId === product._id &&
          (lastOwnerId === this.currentUserId || qr.companieId === lastOwnerId)
        );
      });

      this.uniqueDataByName = Array.from(
        new Map(this.companyProducts.map(q => [q.productName, q])).values()
      );

      this.countOfQrcodes = this.uniqueDataByName.map(qrcode => ({
        name: qrcode.productName || '',
        id: qrcode._id || '',
        count: this.companyProducts.filter(q => q.productName === qrcode.productName).length,
        imageUrl: this.sanitizer.bypassSecurityTrustUrl(qrcode.imageDataUrl || '')
      }));
    });

    /**
     * QR codes for user-owned products
     */
    this.productService.getAllProducts().pipe(
      tap(products => {
        this.userProducts = products.filter(p => p.owner?.slice(-1)[0] === this.currentUserId);

        const qrcodeObservables = this.userProducts
          .filter(p => p._id && p.companieId)
          .map(product =>
            this.profileQrcodeService.getQrcodeByProductAndCompany(product._id!, product.companieId!)
          );

        if (qrcodeObservables.length === 0) return;

        forkJoin(qrcodeObservables).subscribe((qrcodes: any[]) => {
          const filtered = qrcodes.filter((q: any): q is Qrcode => q !== null);
          this.userQrcodes = filtered;

          this.uniqueQrcodes = Array.from(new Map(this.userQrcodes.map(q => [q.productName, q])).values())
            .map(qrcode => ({
              name: qrcode.productName || '',
              id: qrcode._id || '',
              count: 1, // chaque QR code ici est unique
              imageUrl: this.sanitizer.bypassSecurityTrustUrl(qrcode.imageDataUrl || '')
            }));
        });
      }),
      catchError(err => {
        console.error('Erreur while retrieving compagnie or user QR code', err);
        return of([]);
      })
    ).subscribe();
  }
}

