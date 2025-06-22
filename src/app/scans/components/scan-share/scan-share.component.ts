import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { LoginService } from '../../../auth/components/services/login.service';
import { Product } from '../../../product/models/product-model';
import { ProductService } from '../../../product/services/product.service';
import { TransferUrlService } from '../../../services/transferUrl.service';
import { UserService } from '../../../user/components/services/user.service.ts.service';

@Component({
  selector: 'app-scan-share',
  templateUrl: './scan-share.component.html',
  styleUrls: ['./scan-share.component.scss']
})
export class ScanShareComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  
  currentUserId!: string;
  currentUserFirstName!: string;
  currentUserLastName!: string;
  currentUserCompanie!: string;
  currentUserCity!: string;
  currentUserCountry!: string;
  userImageUrl!: string;
  currentUserPhoto!: SafeUrl;

  userUrlScannedId!: string;

  userProducts!: Product[] | null;
  totalUserProducts!: number;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private productService: ProductService,
    private transferUrlService: TransferUrlService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.initUserInfo();
    this.getUserbyUrlId();
    this.countUserProducts();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initUserInfo(){
    const userId = this.loginService.getUserInfo().userId;
    if (!userId) return;
    this.currentUserId = userId;

    const urlScannedId = this.transferUrlService.getScannedUserId();

    if (urlScannedId) {
      this.userUrlScannedId = urlScannedId;
    }
    
    localStorage.removeItem('scannedUserId');
  }

  private getUserbyUrlId(): void{

    this.userService.getUserById(this.userUrlScannedId ).pipe(
      tap(data => {
        if (data) {
          this.currentUserFirstName = data.firstName;
          this.currentUserLastName = data.lastName;
          this.currentUserCompanie = data.companie;
          this.currentUserCity = data.city;
          this.currentUserCountry = data.country;
          this.userImageUrl = data.profilPhoto;
          this.currentUserPhoto = this.sanitizer.bypassSecurityTrustUrl(this.userImageUrl);
        }
      }),
      catchError(error => {
        console.error('Error fetching user data:', error);
        return of(null); 
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();

  }

  private countUserProducts(): void {
    this.productService.getAllProducts().pipe(
      tap(data =>{
        if(data) {
          this.userProducts = data.filter(product => product.owner[product.owner.length -1] === this.userUrlScannedId);
          this.totalUserProducts = this.userProducts.length;
        }
      }

      )
    ).subscribe();
  }

  navigateToNews() {
    this.router.navigate(['/teik/news']);
  }


}
