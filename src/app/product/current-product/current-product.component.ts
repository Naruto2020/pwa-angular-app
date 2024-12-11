import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap, takeUntil, tap } from 'rxjs';
import { of, Subject } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '@app/user/components/services/user.service.ts.service';
import { ProductService } from '../services/product.service';
import { LoginService } from '@app/auth/components/services/login.service';

@Component({
  selector: 'app-current-product',
  templateUrl: './current-product.component.html',
  styleUrls: ['./current-product.component.scss']
})
export class CurrentProductComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();

  currentProductName!: string;
  expiryDate!: string;
  companieName!: string;
  productImageUrl!: string;
  currentProductPhoto!: SafeUrl;
  currentOwnerId!: string;
  currentProductState!: string

  ownerfirstName!: string;
  ownerCity!: string;
  ownerCountry!: string;
  ownerImgUrl!: string;
  ownerPhoto!: SafeUrl;

  currentuserId!: string;
  
  constructor(private userService: UserService, private route: ActivatedRoute, 
    private router: Router, private sanitizer: DomSanitizer, 
  private productService: ProductService, private loginService: LoginService) { }

  ngOnInit(): void {
    const userId = this.loginService.getUserInfo().userId;
    if (!userId) return;
    this.currentuserId = userId;

    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$),
      switchMap(paramMap => {
        const productId = paramMap.get('id');
        if (!productId) return of(null);

        return this.productService.getCurrentProduct(productId).pipe(
          tap(data => {
            if (data) {
              this.currentProductName = data.name;
              this.expiryDate = data.expiryDate;
              this.companieName = data.companieName;
              this.productImageUrl = data.productPhoto;
              this.currentProductState = data.isAlreadyUse.toUpperCase();
              this.currentProductPhoto = this.sanitizer.bypassSecurityTrustUrl(this.productImageUrl);
              this.currentOwnerId = data.owner[data.owner.length - 1];
            }
          }),
          catchError(error => {
            console.error('Error fetching product data:', error);
            return of(null); 
          })
        );
      }),
      switchMap(() => {
        if (!this.currentOwnerId) return of(null);
        return this.userService.getOwnerProduct(this.currentOwnerId).pipe(
          tap(data => {
            if (data) {             
              this.ownerfirstName = data.firstName;
              this.ownerCity = data.city;
              this.ownerCountry = data.country;
              this.ownerImgUrl = data.profilPhoto;
              this.ownerPhoto = this.sanitizer.bypassSecurityTrustUrl(this.ownerImgUrl);
            }
          }),
          catchError(error => {
            console.error('Error fetching owner data:', error);
            return of(null); 
          })
        );
      })
    ).subscribe();
  }


}
