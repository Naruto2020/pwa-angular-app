import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { LoginService } from '../../../auth/components/services/login.service';
import { Product } from '../../../product/models/product-model';
import { ProductService } from '../../../product/services/product.service';
import { NotificationsService } from '../../../services/notifications.service';
import { UserService } from '../../../user/components/services/user.service.ts.service';
import { Notification } from '../../components/model/notification-model';

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
    private productService: ProductService,
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userId = this.loginService.getUserInfo().userId;
    if (!userId) return;
    this.currentuserId = userId;

    this.notificationsService.displayAllNotifications().pipe(
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
                  
                  // Force Angular to refresh display
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

          const matchingProduct = this.products.find(pdt => notif.data.productOwnerId === pdt.owner[pdt.owner.length - 1]);
          if (matchingProduct) {
            this.filteredProducts.set(notif._id, matchingProduct);
          }
          
        });
      })
    ).subscribe();

    this.productService.getAllProducts().pipe(
      tap(data => {
        if (data) {
          this .products = data;
        }
      })
    ).subscribe();
  }
}
