import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, delay, map, of } from "rxjs";
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

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`http://127.0.0.1:8002/teko/gateway-products/products`).pipe(
      catchError(() => of().pipe(
        delay(1000)
      ))
    );
  }

  sendRequestProduct(requestParams: any) {
    return this.http.post(`http://127.0.0.1:8002/teko/gateway-products/request_product`, requestParams).pipe(
      catchError(() => of().pipe(
        map(response => response), 
        delay(1000)
      ))
    );
  }

  transfertProduct(requestParams: any) {
    console.log(" ==> : ", requestParams);
    return this.http.post(`http://127.0.0.1:8002/teko/gateway-products/transfer_product`, requestParams).pipe(
      catchError(() => of().pipe(
        map(response => response), 
        delay(1000)
      ))
    );
  }
  consumeProduct(requestParams: any) {
    return this.http.post(`http://127.0.0.1:8002/teko/gateway-products/consume_product`, requestParams).pipe(
      catchError(() => of().pipe(
        map(response => response), 
        delay(1000)
      ))
    );
  }
}