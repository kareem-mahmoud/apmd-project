import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../api/api-service';
import { delay } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiService = inject(ApiService);

  fetchProducts() {
    return this.apiService.getProducts().pipe(delay(2000));
  }

  fetchProductById(id: number) {
    return this.apiService.getProductById(id).pipe(delay(2000));
  }

  fetchCategories() {
    return this.apiService.getCategories();
  }

  fetchProductsByCategory(category: string) {
    return this.apiService.getProductsByCategory(category);
      // return throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' }));
  }

}
