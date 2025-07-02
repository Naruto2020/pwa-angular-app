import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { catchError, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { LoginService } from '../../../auth/components/services/login.service';
import { Product } from '../../../product/models/product-model';
import { ProductService } from '../../../product/services/product.service';
import { NotificationsService } from '../../../services/notifications.service';
import { UserService } from '../../../user/components/services/user.service.ts.service';
import { Notification } from '../../components/model/notification-model';
import { Notif } from '../../interfaces/notif.interface';

@Component({
  selector: 'app-notif',
  templateUrl: './notif.component.html',
  styleUrls: ['./notif.component.scss']
})
export class NotifComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();

  notifications!: Notification[];
  currentuserId!: string;
  userInfos = new Map<string, { firstName: string; lastName: string; photo: SafeUrl }>();
  products!: Product[];
  filteredProducts = new Map<string, any>(); 

  constructor(
    private notificationsService: NotificationsService,
    private loginService: LoginService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initUserInfos();
    this.getProductsMatchingNotification();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initUserInfos(): void {
        const userId = this.loginService.getUserInfo().userId;
    if (!userId) return;
    this.currentuserId = userId;
  }

  private getProductsMatchingNotification(): void{
    this.productService.getAllProducts().pipe(
      tap(data => {
        if (data) {
          this.products = data;
        }
      }),
      switchMap(() => this.notificationsService.displayAllNotifications()),
      tap((notifications) => {
        if (!notifications || notifications.length === 0) return;
        this.notifications = notifications;

        notifications.forEach((notif) => {
          const requestUserId = notif.userId;
    
          if (!this.userInfos.has(requestUserId)) {
            this.userService.getUserById(requestUserId).pipe(
              tap(data => {
                if (data) {
                  this.userInfos.set(requestUserId, {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    photo: this.sanitizer.bypassSecurityTrustUrl(data.profilPhoto)
                  });
                  setTimeout(() => this.cdr.detectChanges(), 0);
                }
              }),
              catchError(error => {
                console.error(`Error fetching user ${requestUserId} data:`, error);
                return of(null);
              }),
              takeUntil(this.unsubscribe$)
            ).subscribe();
          }
    
          const matchingProduct = this.products.find(pdt =>
            notif.data.productId === pdt._id
          );
          if (matchingProduct) {
            this.filteredProducts.set(notif._id, matchingProduct);
          }
        });
      }),
      catchError(err => {
        console.error('Error fetching data', err);
        return of([]);
      })
    ).subscribe();
  }


  markAsRead(notif : Notification) {
    const notificationRead: Notif = { isRead: 'oui' };
    
    if (notif.isRead === 'oui') {
      this.router.navigate(['/teik/products/current-product', notif.data.productId], {
        queryParams: { notificationId: notif._id },
      });
      return;
    }

    this.notificationsService.markNotificationAsRead(notif._id, notificationRead).pipe(
      tap((updatedNotification) => {
        if (updatedNotification) {
          notif.isRead = updatedNotification.isRead;
          this.cdr.detectChanges(); // Trigger change detection
          this.router.navigate(['/teik/products/current-product', notif.data.productId], {
            queryParams: { notificationId: notif._id },
          });
        }
      }),
      catchError(err => {
        console.error('Error marking notification as read', err);
        return of(null);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }


  handleNotificationClick(notif: any): void {
  this.markAsRead(notif);

  if (notif.type === 'acquisition') {
    const productId = notif.data.productId;
    this.router.navigate(['/teik/product/current', productId]);
  } else if (notif.type === 'signal') {
    const userId = notif.userId;
    this.router.navigate(['/teik/user/scan-user', userId]);
  }
}

}
