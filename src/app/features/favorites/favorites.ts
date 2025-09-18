import { Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Product } from '../../core/modules/app-module';
import { ProductsService } from '../../core/services/products-service/products-service';
import { StorageService } from '../../core/services/storage/storage';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class Favorites {
  private storageService = inject(StorageService);
  private productsService = inject(ProductsService);

  private favoriteIds$ = toObservable(this.storageService.favoriteIds);

  private productsResult$ = this.favoriteIds$.pipe(
    switchMap(ids => {
      if (ids.length === 0) {
        return of({ isLoading: false, products: [] });
      }

      const productObservables = ids.map(id =>
        this.productsService.fetchProductById(id).pipe(
          catchError(error => {
            console.error(`Failed to fetch product with id ${id}`, error);
            return of(null); // Return null for failed requests
          })
        )
      );

      return forkJoin(productObservables).pipe(
        map(products => products.filter((p): p is Product => p !== null)), // Filter out nulls
        map(products => ({ isLoading: false, products })),
        startWith({ isLoading: true, products: [] })
      );
    })
  );

  private productsResult = toSignal(this.productsResult$, {
    initialValue: { isLoading: true, products: [] }
  });

  readonly isLoading = computed(() => this.productsResult().isLoading);
  readonly favoriteProducts = computed(() => this.productsResult().products);

}