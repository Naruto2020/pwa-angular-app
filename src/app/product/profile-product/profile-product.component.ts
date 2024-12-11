import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, of, Subject, tap, catchError  } from 'rxjs';
import { UserService } from '@app/user/components/services/user.service.ts.service';
import { LoginService } from '@app/auth/components/services/login.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  countOfProducts: ProductCount[] = [];
  productIdForTest!: string; // to cancel later

  constructor(
    private productService: ProductService,
    private loginService: LoginService,
    private userService: UserService,
    private route: ActivatedRoute, 
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    const userId = this.loginService.getUserInfo().userId;
    const compagnieName = this.loginService.getUserInfo().firstName;
    if (!userId || !compagnieName) return;

    this.currentuserId = userId;
    this.currentUserFirstName = compagnieName;
    //console.log("lock : ", this.currentuserId);

    this.productService.getAllCompanieProducts(this.currentuserId).pipe(
      tap(data => {
        if (data) {
          //console.log("production : ", data)
          // Extraire les produits avec des noms uniques
          this.uniqueDataByName = Array.from(new Map(data.map(item => [item.name, item])).values());
          //console.log(' les produits : ', this.uniqueDataByName);

          // Compter les occurrences de chaque produit par nom
          this.countOfProducts = this.uniqueDataByName.map((product: Product) => {
            const count = data.filter(p => p.name === product.name).length;
            const productPhoto = this.sanitizer.bypassSecurityTrustUrl(product.productPhoto || '');
            const prodctId = product._id ? product._id : 'ID non défini'; // cancel later
            return { name: product.name, id: prodctId, count: count, imageUrl: productPhoto };
          });
          this.productIdForTest = this.countOfProducts[0].id // cancel later
          //console.log('nombre d\'occurence : ', this.countOfProducts[0]);
        }
      })
    ).subscribe();
  }
}
