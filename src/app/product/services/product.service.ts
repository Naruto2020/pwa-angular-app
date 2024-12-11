import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, delay, map, of, tap } from "rxjs";
import { Product } from "../models/product-model";

@Injectable()
export class ProductService {
  constructor (private http: HttpClient) {}

  createProduct(formValue: Product): Observable<Product | null> {
      return this.http.post<Product>('http://127.0.0.1:8002/teko/gateway-products/products', formValue).pipe(
          
          delay(1000), 
          map(response => response), 
          catchError(() => of(null).pipe(
            delay(1000) 
          ))
        );
  }

  getAllCompanieProducts(companieId: string ): Observable<Product[]> {
      return this.http.get<Product[]>(`http://127.0.0.1:8002/teko/gateway-products/companie/${companieId}`).pipe(
        catchError(() => of([]).pipe(
          delay(1000)
        ))
      );
  }

  getCurrentProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`http://127.0.0.1:8002/teko/gateway-products/${productId}`).pipe(
      catchError(() => of().pipe(
        delay(1000)
      ))
    );
  }
}