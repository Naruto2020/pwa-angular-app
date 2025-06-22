import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '@app/auth/components/services/login.service';
import { UserService } from '@app/user/components/services/user.service.ts.service';
import { catchError, forkJoin, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { NotificationsService } from '../../../services/notifications.service';
import { TransferUrlService } from '../../../services/transferUrl.service';
import { ImageUploadService } from '../../../shared/services/image-upload.service';
import { User } from '../../../user/components/models/user-model';
import { UpdateProduct } from '../../interfaces/updateProduct.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-current-product',
  templateUrl: './current-product.component.html',
  styleUrls: ['./current-product.component.scss']
})
export class CurrentProductComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  currentProductName!: string;
  expiryDate!: string;
  companieName!: string;
  productImageUrl!: string;
  certificateImageUrl!: string;
  certificatePhoto!: SafeUrl;
  currentProductPhoto!: SafeUrl;
  currentOwnerId!: string;
  currentUserCompanieStatus!: string;
  currentProductState!: string;

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
  isFashionProduct!: string;
  productCreatedDate!: string;
  productCreatedCity!: string;

  purchaseDate!: string;

  productOwnershistory: string[] = [];
  ownershipHistory: User[] = [];
  lose: boolean = false;
  productLose!: boolean;

  successMessage: string | null = null;
  errorMessage: string | null = null;


  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private productService: ProductService,
    private loginService: LoginService,
    private notificationService: NotificationsService,
    private transferUrlService: TransferUrlService,
    private imageUploadService: ImageUploadService,
  ) { }

  ngOnInit(): void {
    this.initUserInfos();
    this.extractRouteParamsAndLoadProduct();
    this.listenToQueryParams();

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initUserInfos(): void {
    const userInfo = this.loginService.getUserInfo();
    if (!userInfo || !userInfo.userId || !userInfo.companie) {
      console.error('User information is not available');
      return;
    }
    this.currentUserId = userInfo.userId;
    this.currentUserCompanieStatus = userInfo.companie;
  }

  private extractRouteParamsAndLoadProduct(): void {
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$),
      switchMap(paramMap => {
        const productId = paramMap.get('id');
        if (!productId) return of(null);
        this.currentProductId = productId;
        return this.loadProduct();
      }),
      switchMap(() => this.loadProductOwners()),
      switchMap(() => this.loadCurrentOwner()),
    ).subscribe();
  }

  private listenToQueryParams(): void {
    this.route.queryParams.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      if (params['notificationId']) {
        this.selectedNotificationId = params['notificationId'];
        this.getPurchaserUserId();
      }
    });
  }

  loadProduct() {
    return this.productService.getCurrentProduct(this.currentProductId).pipe(
      tap(data => {
        if (data && data.isLost !== undefined) {
          this.currentProductName = data.name;
          this.expiryDate = data.expiryDate;
          this.companieName = data.companieName;
          this.productImageUrl = data.productPhoto;
          this.certificateImageUrl = data.certificatePhoto;
          this.currentProductState = data.isAlreadyUse.toUpperCase();
          this.currentProductPhoto = this.sanitizer.bypassSecurityTrustUrl(this.productImageUrl);
          this.certificatePhoto = this.sanitizer.bypassSecurityTrustUrl(this.certificateImageUrl);
          this.productOwnershistory = data.owner;
          this.isFashionProduct = data.isFashion;
          this.productCreatedDate = data.createdAt;
          this.productCreatedCity = data.city;
          this.currentOwnerId = data.owner[data.owner.length - 1];
          this.productLose = data.isLost;
        }
      }),
      catchError(error => {
        console.error('Error fetching product data:', error);
        return of(null);
      })
    );
  }

  loadProductOwners() {
    if (!this.productOwnershistory || this.productOwnershistory.length === 0) return of([]);

    const userRequests = this.productOwnershistory.map(ownerId => {
      return this.userService.getOwnerProduct(ownerId).pipe(
        catchError(error => {
          console.error(`Error fetching owner ${ownerId}:`, error);
          return of(null);
        })
      );
    });

    return forkJoin(userRequests).pipe(
      tap(data => {
        this.ownershipHistory = data.filter((user): user is User => user !== null);
      })
    );
  }

  loadCurrentOwner() {
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
  }

  getPurchaserUserId() {
    this.notificationService.displayAllNotifications().pipe(
      takeUntil(this.unsubscribe$),
      tap((notifications) => {
        if (!notifications || notifications.length === 0) return;
        const selectedNotif = notifications.find(notif => notif._id === this.selectedNotificationId);
        if (selectedNotif) {
          this.purchaserUserId = selectedNotif.userId;
        }
      })
    ).subscribe();
  }

  purchaseProduct() {
    const requestParams = {
      userId: this.currentUserId,
      productId: this.currentProductId,
    };

    this.productService.sendRequestProduct(requestParams).pipe(
      takeUntil(this.unsubscribe$),
      tap((notification) => {
        if (notification) {
          this.successMessage = '✅ Demande d’achat envoyée avec succès.';
          this.errorMessage = null;
        }
      }),
      catchError(error => {
        this.successMessage = null;
        this.errorMessage = '❌ Une erreur est survenue lors de l’envoi de la demande.';
        console.error('Error sending request:', error);
        return of(null);
      })
    ).subscribe();
  }

  transfertProduct() {
    if (!this.purchaserUserId) {
      const urlScannedId = this.transferUrlService.getScannedUserId();
      if (urlScannedId) {
        this.purchaserUserId = urlScannedId;
      } else {
        this.successMessage = null;
        this.errorMessage = '❌ Aucun ID d’acheteur disponible scannez dabord un utilisateur ou passez par notification';
        console.warn('Aucun ID d’acheteur disponible');
        return;
      }
    }

    if (!this.currentProductId) {
      this.errorMessage = '❌ Le produit n’est pas défini. Veuillez scanner un produit.';
      this.successMessage = null;
      console.error('Le produit n’est pas défini');
      return;
    }

    const requestParams = {
      purchaserUserId: this.purchaserUserId,
      productId: this.currentProductId,
    };

    this.productService.transfertProduct(requestParams).pipe(
      takeUntil(this.unsubscribe$),
      tap((notification) => {
        if (notification) {
          this.successMessage = '✅ Transfert effectué avec succès.';
          this.errorMessage = null;

          this.purchaseDate = new Date().toISOString();
          this.successMessage = 'Transfert effectué avec succès';
          // forkJoin([
          //   this.loadProduct(),
          //   this.loadProductOwners(),
          //   this.loadCurrentOwner()
          // ]).subscribe();
        }
        localStorage.removeItem('scannedUserId');
      }),
      catchError(error => {
        this.successMessage = null;
        this.errorMessage = '❌ Une erreur est survenue lors du transfert.';

        console.error('Erreur lors du transfert :', error);
        this.errorMessage = 'Une erreur est survenue lors du transfert';
        return of(null);
      })
    ).subscribe();
  }


  consumeProduct() {
    const requestParams = {
      userId: this.currentUserId,
      productId: this.currentProductId,
    };

    this.productService.consumeProduct(requestParams).pipe(
      takeUntil(this.unsubscribe$),
      tap((notification) => {
        this.successMessage = '✅ Produit consommé avec succès.';
        this.errorMessage = null;

        const dateOfConsumption = new Date();
        this.consumeDate = dateOfConsumption.toISOString();
        console.log('Request sent successfully:', notification);
      }),
      catchError(error => {
        this.successMessage = null;
        this.errorMessage = '❌ Une erreur est survenue lors de la consommation.';

        console.error('Error sending request:', error);
        return of(null);
      })
    ).subscribe();
  }

  previewImage() {
    window.open(this.certificateImageUrl, '_blank');
  }

  downloadImage() {
    const link = document.createElement('a');
    link.href = this.certificateImageUrl;
    link.download = 'certificat.jpg';
    link.click();
  }

  onImageUploaded(): void {
    this.loadProduct().subscribe();
  }

  loseOrFound(): void {
    const newIsLostValue = !this.productLose;

    const updatedProduct: UpdateProduct = { isLost: newIsLostValue };

    this.productService.updateCurrentProduct(this.currentProductId, updatedProduct).pipe(
      tap((product) => {
        if (product && product.isLost !== undefined) {
          this.productLose = product.isLost;
          this.lose = product.isLost;
          console.log(`Produit ${product.isLost ? 'marqué comme perdu' : 'retrouvé'}`);
          this.loadProduct();
        }
      }),
      catchError(error => {
        this.errorMessage = '❌ Une erreur est survenue lors de la mise à jour du produit.';
        this.successMessage = null;
        console.error('Erreur lors de la mise à jour du produit :', error);
        return of(null);
      })
    ).subscribe();
  }

  clearMessages() {
    this.successMessage = null;
    this.errorMessage = null;

    forkJoin([
      this.loadProduct(),
      this.loadProductOwners(),
      this.loadCurrentOwner()
    ]).subscribe();
  }

}
