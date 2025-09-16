import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../api/api-service';
import { delay } from 'rxjs/operators';

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


}
