import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '@app/auth/components/services/login.service';
import { UserService } from '@app/user/components/services/user.service.ts.service';
import { Subject, tap } from 'rxjs';
import { ProductService } from '../../services/product.service';

interface Product {
  name: string;
  _id?: string;
  productPhoto?: string;
}

interface ProductCount {
  name: string;
  id: string;
  count: number;
  imageUrl: SafeUrl;
}

@Component({
  selector: 'app-profile-product',
  templateUrl: './profile-product.component.html',
  styleUrls: ['./profile-product.component.scss']
})
export class ProfileProductComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  currentUserId!: string;
  uniqueDataByName!: Product[];
  currentUserFirstName!: string;
  currentUserLastName!: string; 
  currentUserCompanie!: string;
  countOfProducts: ProductCount[] = [];
  userProducts!: Product[] | null;
  uniqueProducts: ProductCount[] = [];
  userProfilePhoto!: SafeUrl 


  constructor(
    private productService: ProductService,
    private loginService: LoginService,
    private userService: UserService,
    private route: ActivatedRoute, 
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.initUserInfo();
    this.getProductsCategory(this.currentUserCompanie);
    this.getProductsInfo();
    
  }

  private initUserInfo(): void {
    const userInfo = this.loginService.getUserInfo();
    if (!userInfo?.userId || !userInfo?.firstName || !userInfo?.lastName || !userInfo?.companie) return;

  
    this.currentUserId = userInfo.userId;
    this.currentUserFirstName = userInfo.firstName;
    this.currentUserLastName = userInfo.lastName;
    this.currentUserCompanie = userInfo.companie ;
    this.userService.getCurrentUser(this.currentUserId).pipe(
      tap(user => {
        if (user && user.profilPhoto) {
          this.userProfilePhoto = this.sanitizer.bypassSecurityTrustUrl(user.profilPhoto);
        }
      })
    ).subscribe();
  }

  private getProductsCategory(companyId: string): void {
    this.productService.getAllCompanieProducts(this.currentUserId).pipe(
      tap(products => {
        if (products) {
          const productOwnByUser = products.filter(p => p.owner?.slice(-1)[0] === this.currentUserId);
          this.uniqueDataByName = Array.from(new Map(productOwnByUser.map(p => [p.name, p])).values());
          this.countOfProducts = this.uniqueDataByName.map(product => ({
            name: product.name,
            id: product._id || '',
            count: productOwnByUser.filter(p => p.name === product.name).length,
            imageUrl: this.sanitizer.bypassSecurityTrustUrl(product.productPhoto || '')
          }));
        }
      })
    ).subscribe();
  }

  private getProductsInfo(): void {
    this.productService.getAllProducts().pipe(
      tap(allProducts => {
        if (allProducts) {
          this.userProducts = allProducts.filter(p => p.owner?.slice(-1)[0] === this.currentUserId);
          this.uniqueProducts = Array.from(new Map(this.userProducts.map(p => [p.name, p])).values())
            .map(product => ({
              name: product.name,
              id: product._id || '',
              count: 1, // Default count to 1 for each unique product
              imageUrl: this.sanitizer.bypassSecurityTrustUrl(product.productPhoto || '')
            }));
        }
      })
    ).subscribe();
  }
    
  
}
