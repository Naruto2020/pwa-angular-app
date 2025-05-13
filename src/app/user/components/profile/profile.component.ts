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
  currentUserPhoto!: SafeUrl;
  loading: boolean = true;
  numberOfProducts!: number;
  totalProduct!: number;
  userProducts!: Product[] | null;
  totalUserProducts!: number;
  totalUserUniqueProducts!: number;

  constructor(private userService: UserService, private route: ActivatedRoute, 
    private router: Router, private sanitizer: DomSanitizer, 
    private productService: ProductService, private loginService: LoginService, ) { }

  ngOnInit(): void {
    /** execice for technical tests  */

    // function sumTo(n: number): number {
    //   //return (n * (n + 1)) / 2;
    //   let sum = 0;
    //   for (let i=1; i <= n; i++) {
    //     sum += i;
    //   }
    //   console.log('sum : ', sum);
    //   return sum;
    // }

    // sumTo(10); // 55
    // sumTo(100); // 5050
    // sumTo(5); // 15

    // function reverseString(str: string): string {
    //   console.log(str.split('').reverse().join(''))
    //   return str.split('').reverse().join('');
    // }

    // reverseString('hello'); // 'olleh'
    // reverseString('world'); // 'dlrow'
    // reverseString('12345'); // '54321'

    // function findOdd(arr: number[]): number {
    //   return arr.reduce((acc, curr) => acc ^curr, 0);

    // }
    // console.log("Impair => : ",findOdd([1, 2, 3, 2, 3, 1, 5])) //5

    // //function isPalindrome(str: string): boolean {}

    const userId = this.loginService.getUserInfo().userId;
    if (!userId) return;
    this.currentUserId = userId;
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

    this.productService.getAllCompanieProducts(this.currentUserId).pipe(
      tap(data => {
        if(data) {
          this.totalProduct = data.length;
          console.log(' les pro : ', this.totalProduct);
          // extract product by unique name 
          const uniqueDataByName = Array.from(new Map(data.map(item => [item.name, item])).values());
          this.numberOfProducts = uniqueDataByName.length;
          console.log(' les produits : ', this.numberOfProducts);
        }
      })
    ).subscribe();

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
}
