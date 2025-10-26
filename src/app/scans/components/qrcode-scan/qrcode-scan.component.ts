import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { catchError, concatMap, finalize, forkJoin, from, map, of, Subject, takeUntil, tap } from 'rxjs';
import { LoginService } from '../../../auth/components/services/login.service';
import { PostSignal } from '../../../posts/models/post-model';
import { PostsService } from '../../../posts/services/posts.service';
import { ProductService } from '../../../product/services/product.service';
import { TransferUrlService } from '../../../services/transferUrl.service';
import { UserService } from '../../../user/components/services/user.service.ts.service';
import { newSignal } from '../../interfaces/qrcode-scan.interfaces';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-qrcode-scan',
  templateUrl: './qrcode-scan.component.html',
  styleUrls: ['./qrcode-scan.component.scss']
})
export class QrcodeScanComponent implements OnInit, AfterViewInit {
  private unsubscribe$ = new Subject<void>();

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  codeReader = new BrowserMultiFormatReader();
  scanning = false;
  isFakeUrl = false;
  fakeUrl: string | null = null;
  multiScanMode = false;
  scanUrls: string[] = [];
  allPosts: PostSignal[] = [];
  signalPost: newSignal[] = [];
  userUrlScanned!: string;
  urlProductArray: string[] = []
  urlUserArray: string[] = []

  purchaserUserId!: string;
  purchaseDate!: string;
  currentUserId!: string;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private postsService: PostsService,
    private loginService: LoginService,
    private userService: UserService,
    private transferUrlService: TransferUrlService,
    private sanitizer: DomSanitizer,
    private productService: ProductService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getPostedUserData();
    this.initUserInfo();
  }

  private initUserInfo(): void {
    const userInfo = this.loginService.getUserInfo();
    if (!userInfo || !userInfo.userId) {
      console.error('User information is not available');
      return;
    }

    this.currentUserId = userInfo.userId;
  }

  private getPostedUserData(): void {
    this.postsService.getPosts().pipe(
      tap(posts => {
        if (posts && posts.length > 0) {
          const postObservables = posts
            .filter(post => post.author !== undefined)
            .map(post =>
              this.userService.getUserById(post.author as string).pipe(
                map(user => ({
                  userName: user?.firstName || 'Unknown User',
                  productName: post.productName,
                  fakeUrl: post.fakeUrl,
                  city: post.city,
                  description: post.description,
                  userImageUrl: this.sanitizer.bypassSecurityTrustUrl(user?.profilPhoto || ''),
                  imageUrl: this.sanitizer.bypassSecurityTrustUrl(post.fakeProductPhoto || ''),
                  date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown Date',
                  storeName: post.storeName
                }))
              )
            );

          forkJoin(postObservables).subscribe((results: newSignal[]) => {
            this.signalPost = results;
          });
        }
      })
    ).subscribe();
  }

  ngAfterViewInit() {
    this.startScan();
  }

  startScan() {
    this.scanning = true;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
      this.videoElement.nativeElement.srcObject = stream;
      this.videoElement.nativeElement.play();

      this.codeReader.decodeFromVideoElement(this.videoElement.nativeElement, (result, err) => {
        if (result) {
          const url = result.getText();
          const allowedProductPrefix = 'http://localhost:4200/teik/products/current-product';
          const allowedUserPrefix = 'http://localhost:4200/teik/user/scan-user';
          
          if (this.isValidUrl(url) && url.startsWith(allowedProductPrefix)) {
            const checkProductId = url.split('/').pop();
            if (!checkProductId) return;
            
            if (this.multiScanMode) {
              if (!this.scanUrls.includes(url)) {
                this.scanUrls.push(url);
                this.transferUrlService.catchProductUrlScanned(this.scanUrls);
              }
            } else {
              this.checkProductId(url, checkProductId);
            }

          } else if (this.isValidUrl(url) && url.startsWith(allowedUserPrefix)) {
            const checkUserId = url.split('/').pop();
            if (!checkUserId) return;
            this.checkUrlId(url, checkUserId);

          } else {
            this.isFakeUrl = true;
            this.fakeUrl = url;
            this.stopScan();
          }
        }
      });

    }).catch(err => {
      console.error('Camera access error :', err);
      alert('Unable to access camera');
    });
  }

  private checkProductId(url: string, checkProductId: string): void {
    this.productService.getCurrentProduct(checkProductId).pipe(
      tap(product => {
        if ((product && product.isLost === false) || (product && product.owner[product.owner.length - 1] === this.currentUserId) ) {
          console.log('✅ Produit trouvé :', product);
          //this.urlProductArray.push(url);
          window.location.href = url;
        } else if(product && product.isLost === true) {

          const requestParams = {
            userId: this.currentUserId,
            product: product
          }

          this.productService.catchAndSendLostScannedProduct(requestParams).pipe(
            tap(notification => {
              if(notification) {
                this.successMessage = 'HOME.TRANSFER_REFUSED';
                this.errorMessage = null;
              }
            })
          ).subscribe();
          this.stopScan();
        } else {
          console.warn('❌ Produit introuvable');
          this.isFakeUrl = true;
          this.fakeUrl = url;
        }
      })
    ).subscribe();
  }

  private checkUrlId(url: string, checkUrlId: string): void {
    this.userService.getUserById(checkUrlId).pipe(
      tap(user => {
        if (user) {
          //this.urlUserArray.push(url);
          console.log('✅ Utilisateur trouvé :', user);
          this.transferUrlService.catchUserUrlScanned(url);
          //this.stopScan();
          window.location.href = url;
        } else {
          console.warn('❌ Utilisateur introuvable');
          this.isFakeUrl = true;
          this.fakeUrl = url;
          alert('Utilisateur introuvable');
        }
      })
    ).subscribe();
  }

  isValidUrl(url: string): boolean {
    const pattern = new RegExp('^(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*(\.[a-z]{2,5})?(:[0-9]{1,5})?(\/.*)?$', 'i');
    return pattern.test(url);
  }

  transfertProduct(){
    const scannedUserId = this.transferUrlService.getScannedUserId();
    if (scannedUserId) {
      this.purchaserUserId = scannedUserId;
    } else {
      console.warn('Aucun ID acheteur trouvé');
      return;
    }

    let productIds: string[] = [];
    productIds = this.transferUrlService.getScannedProductId(); 
    if (productIds.length === 0) {
      console.warn('Aucun ID de produit trouvé');
      return;
    }
    from(productIds).pipe(
      concatMap(productId => {
        const requestParams = {
          purchaserUserId: this.purchaserUserId,
          productId: productId,
        };
        return this.productService.transfertProduct(requestParams).pipe(
          tap((notification) => {
            console.log(`Produit ${productId} transféré`);
          }),
          catchError(error => {
            console.error(`Erreur lors du transfert du produit ${productId}:`, error);
            return of(null);
          })
        );
      }),
      finalize(() => {
        // Action après tous les transferts
        this.purchaseDate = new Date().toISOString();
        //this.successMessage = 'Transfert terminé';
        this.scanUrls = [];
        localStorage.removeItem('scannedUserUrl');
        localStorage.removeItem('scannedProductUrl');
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  stopScan() {
    this.scanning = false;
    const stream = this.videoElement.nativeElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  clearMessages() {
    this.successMessage = null;
    this.errorMessage = null;
  }
}
