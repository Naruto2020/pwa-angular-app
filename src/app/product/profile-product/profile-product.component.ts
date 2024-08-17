import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, of, Subject, tap, catchError  } from 'rxjs';
import { UserService } from '@app/user/components/services/user.service.ts.service';
import { LoginService } from '@app/auth/components/services/login.service';

interface Product {
  name: string;
  description?: string;
  imageUrl?: string;
}

interface ProductCount {
  name: string;
  count: number;
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

  constructor(
    private productService: ProductService,
    private loginService: LoginService,
    private userService: UserService,
    private route: ActivatedRoute, 
    private router: Router
  ) { }

  ngOnInit(): void {
    const userId = this.loginService.getUserInfo().userId;
    const compagnieName = this.loginService.getUserInfo().firstName;
    if (!userId || !compagnieName) return;

    this.currentuserId = userId;
    this.currentUserFirstName = compagnieName;
    console.log("lock : ", this.currentuserId);

    this.productService.getAllCompanieProducts(this.currentuserId).pipe(
      tap(data => {
        if (data) {
          // Extraire les produits avec des noms uniques
          this.uniqueDataByName = Array.from(new Map(data.map(item => [item.name, item])).values());
          console.log("datte : ", data);

          // Compter les occurrences de chaque produit par nom
          this.countOfProducts = this.uniqueDataByName.map((product: Product) => {
            const count = data.filter(p => p.name === product.name).length;
            return { name: product.name, count: count };
          });

          console.log('nombre d\'occurence : ', this.countOfProducts);
        }
      })
    ).subscribe();
  }
}
