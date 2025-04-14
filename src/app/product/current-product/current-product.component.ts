import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '@app/auth/components/services/login.service';
import { UserService } from '@app/user/components/services/user.service.ts.service';
import { catchError, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';
import { ProductService } from '../services/product.service';

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

  currentUserId!: string;
  currentProductId!: string;
  selectedNotificationId!: string;
  purchaserUserId!: string;

  consumeDate!: string;
  

  
  constructor(private userService: UserService, private route: ActivatedRoute, 
    private router: Router, private sanitizer: DomSanitizer, 
  private productService: ProductService, private loginService: LoginService, private notificationService: NotificationsService) { }

  ngOnInit(): void {
    const userId = this.loginService.getUserInfo().userId;
    if (!userId) return;
    this.currentUserId = userId;

    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$),
      switchMap(paramMap => {
        const productId = paramMap.get('id');
        if (!productId) return of(null);

        this.currentProductId = productId;



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

    // Retrieve the purchaser user id from query params
    this.route.queryParams.subscribe(params => {
      if(params['notificationId']){
        this.selectedNotificationId = params['notificationId'];
        console.log("Notification ID:", this.selectedNotificationId);
        this.getPurchaserUserId();
      }
    });
  }

  // Method to get the purchaser user id
  getPurchaserUserId() {
    this.notificationService.displayAllNotifications().pipe(
      tap((notifications) => {
        if (!notifications || notifications.length === 0) return;
        
        // Trouver la notification correspondante
        const selectedNotif = notifications.find(notif => notif._id === this.selectedNotificationId);
        if (selectedNotif) {
          this.purchaserUserId = selectedNotif.userId;
          console.log("Acheteur trouvé :", this.purchaserUserId);
        }
      })
    ).subscribe();
  }

  // Method to purchase a product
  purchaseProduct() {
    const requestParams = {
      userId: this.currentUserId,
      productId: this.currentProductId,
    };

    this.productService.sendRequestProduct(requestParams).pipe(
      takeUntil(this.unsubscribe$),
      tap((notification) => {
        console.log('Request sent successfully:', notification);
        alert('Request sent successfully');
      }),
      catchError(error => {
        console.error('Error sending request:', error);
        return of(null); 
      })
    ).subscribe();

    //this.router.navigate(['/product/purchase-product', this.currentProductId]);
  }

  // Method to transfer a product to the new owner
  transfertProduct() {

    if (!this.purchaserUserId || !this.currentProductId) {
      alert("Erreur : Acheteur ou produit non défini !");
      return;
    }

    const requestParams = {
      purchaserUserId: this.purchaserUserId,
      productId: this.currentProductId,
    };

    this.productService.transfertProduct(requestParams).pipe(
      takeUntil(this.unsubscribe$),
      tap((notification) => {
        console.log('Request sent successfully:', notification);
        alert('Request sent successfully');
      }),
      catchError(error => {
        console.error('Error sending request:', error);
        return of(null); 
      })
    ).subscribe();

    //this.router.navigate(['/product/purchase-product', this.currentProductId]);
  }

  consumeProduct(){
    const requestParams = {
      userId: this.currentUserId,
      productId: this.currentProductId,
    };

    this.productService.consumeProduct(requestParams).pipe(
      takeUntil(this.unsubscribe$),
      tap((notification) => {
        const dateOfConsumption = new Date();
        this.consumeDate = dateOfConsumption.toISOString();
        console.log('Request sent successfully:', notification);
        alert('Request sent successfully');
      }),
      catchError(error => {
        console.error('Error sending request:', error);
        return of(null); 
      })
    ).subscribe();
  }

}
