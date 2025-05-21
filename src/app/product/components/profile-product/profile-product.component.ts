import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '@app/auth/components/services/login.service';
import { UserService } from '@app/user/components/services/user.service.ts.service';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
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
  currentuserId!: string;
  uniqueDataByName!: Product[];
  currentUserFirstName!: string;
  currentUserCompanie!: string;
  countOfProducts: ProductCount[] = [];
  userProducts!: Product[] | null;
  uniqueProducts: ProductCount[] = [];
  //productIdForTest!: string; // to cancel later

  constructor(
    private productService: ProductService,
    private loginService: LoginService,
    private userService: UserService,
    private route: ActivatedRoute, 
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    const userInfo = this.loginService.getUserInfo();
    if (!userInfo?.userId || !userInfo?.firstName) return;
  
    this.currentuserId = userInfo.userId;
    this.currentUserFirstName = userInfo.firstName;
  
    this.userService.getCurrentUser(this.currentuserId).pipe(
      tap(user => {
        if (user) this.currentUserCompanie = user.companie;
      }),
      catchError(error => {
        console.error('Erreur récupération utilisateur:', error);
        return of(null);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  
    this.productService.getAllCompanieProducts(this.currentuserId).pipe(
      tap(products => {
        if (products) {
          this.uniqueDataByName = Array.from(new Map(products.map(p => [p.name, p])).values());
          this.countOfProducts = this.uniqueDataByName.map(product => ({
            name: product.name,
            id: product._id || '',
            count: products.filter(p => p.name === product.name).length,
            imageUrl: this.sanitizer.bypassSecurityTrustUrl(product.productPhoto || '')
          }));
        }
      })
    ).subscribe();
  
    this.productService.getAllProducts().pipe(
      tap(allProducts => {
        if (allProducts) {
          this.userProducts = allProducts.filter(p => p.owner?.slice(-1)[0] === this.currentuserId);
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
