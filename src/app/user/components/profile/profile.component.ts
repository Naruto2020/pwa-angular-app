import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service.ts.service';
import { catchError, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProductService } from '@app/product/services/product.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();

  currentuserId!: string;
  currentUserLastName!: string;
  currentUserFirstName!: string;
  currentUserCompanie!: string;
  currentUserCity!: string;
  currentUserCountry!: string;
  userImageUrl!: string;
  currentUserPhoto!: SafeUrl;
  loading: boolean = true;
  numberOfProducts!: number;
  totalProduct!: number;

  constructor(private userService: UserService, private route: ActivatedRoute, 
    private router: Router, private sanitizer: DomSanitizer, private productService: ProductService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(paramMap => {
      const userId = paramMap.get('id');
      if (!userId) return;
      this.currentuserId = userId;
      this.userService.getCurrentUser(userId).pipe(
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
    });

    this.productService.getAllCompanieProducts(this.currentuserId).pipe(
      tap(data => {
        if(data) {
          this.totalProduct = data.length;
          // extract product by unique name 
          const uniqueDataByName = Array.from(new Map(data.map(item => [item.name, item])).values());
          this.numberOfProducts = uniqueDataByName.length;
        }
      })
    ).subscribe();
  }
}
