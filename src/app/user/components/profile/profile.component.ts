import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@app/product/services/product.service';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { LoginService } from '../../../auth/components/services/login.service';
import { Product } from '../../../product/models/product-model';
import { UserService } from '../services/user.service.ts.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();

  currentUserId!: string;
  currentUserLastName!: string;
  currentUserFirstName!: string;
  currentUserCompanie!: string;
  currentUserCity!: string;
  currentUserCountry!: string;
  userImageUrl!: string;
  userQrcodeUrl!: string;
  currentUserPhoto!: SafeUrl;
  currentUserQrcode!: SafeUrl;
  loading: boolean = true;
  numberOfProducts!: number;
  totalProduct!: number;
  userProducts!: Product[] | null;
  totalUserProducts!: number;
  totalUserUniqueProducts!: number;
  qrcodeOwnerId!: string;

  newProducts = [
    { name: 'Jacquard Dior', image: '../../../../assets/images/dior.png' },
    { name: 'Sneaker LV Skate', image: '../../../../assets/images/vuiton.png' },
    { name: 'Gucci Marina Chain', image: '../../../../assets/images/gucci.png' },
    { name: 'Mui Mui sac beau', image: '../../../../assets/images/mui.png' },
    { name: 'Hermes Pendentif Amulettes', image: '../../../../assets/images/hermes.png' },
  ];

  animationSpeed = 'scrollVertical 20s linear infinite';

  constructor(private userService: UserService, private route: ActivatedRoute, 
    private router: Router, private sanitizer: DomSanitizer, 
    private productService: ProductService, private loginService: LoginService, ) { }

  ngOnInit(): void {

    this.initUserInfos();
    this.getUserData();
    this.getUserQrcode();
    this.getCompanieProducts();
    this.getAllUserProducts();

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initUserInfos(): void {
    const userId = this.loginService.getUserInfo().userId;
    if (!userId) return;
    this.currentUserId = userId;
  }

  private getUserData(): void {
    this.userService.getCurrentUser(this.currentUserId).pipe(
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

  private getUserQrcode(): void {
    this.userService.getOwnerQrcode(this.currentUserId).pipe(
      tap(data => {
        if (data) {
          if(!data.userId) return;
          this.qrcodeOwnerId = data.userId;
          this.userQrcodeUrl = data.imageDataUrl;
          this.currentUserQrcode = this.sanitizer.bypassSecurityTrustUrl(this.userQrcodeUrl);
        }
      }),
      catchError(error => {
        console.error('Error fetching QR code:', error);
        return of(null);
      }),
      takeUntil(this.unsubscribe$)    
    ).subscribe();
  }

  private getCompanieProducts(): void {
    this.productService.getAllCompanieProducts(this.currentUserId).pipe(
      tap(data => {
        if(data) {
          const productOwnByUser = data.filter(product => product.owner[product.owner.length -1] === this.currentUserId);
          this.totalProduct = productOwnByUser.length;
          // extract product by unique name 
          const uniqueDataByName = Array.from(new Map(productOwnByUser.map(item => [item.name, item])).values());
          this.numberOfProducts = uniqueDataByName.length;
        }
      })
    ).subscribe();
  }

  private getAllUserProducts(): void {
    this.productService.getAllProducts().pipe(
      tap(data =>{
        if(data) {
          this.userProducts = data.filter(product => product.owner[product.owner.length -1] === this.currentUserId);
          const uniqueProducts = Array.from(new Map(this.userProducts.map(item => [item.name, item])).values());

          this.totalUserProducts = this.userProducts.length;
          this.totalUserUniqueProducts = uniqueProducts.length;
        }
      }

      )
    ).subscribe();
  }

  onImageUploaded() {
    this.getUserData();
  }

  onProductClick(product: any) {
    console.log('Produit cliqué:', product);
    //this.router.navigate(['/teik/products/profile-product']);

  }

}
