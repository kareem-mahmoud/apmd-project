import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { Product } from '../../core/modules/app-module';
import { ProductsService } from '../../core/services/products-service/products-service';
import { StorageService } from '../../core/services/storage/storage';


@Component({
  selector: 'app-product-item',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './product-item.html',
  styleUrl: './product-item.scss'
})
export class ProductItem implements OnInit {
  isLoading = signal<boolean>(true);
  product = signal<Product | undefined>(undefined);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private storageService = inject(StorageService);

  readonly isFavorite = computed(() => {
    const p = this.product();
    return p ? this.storageService.favoriteIds().includes(p.id) : false;
  });
  readonly isInCart = computed(() => {
    const p = this.product();
    return p ? this.storageService.cartItemIds().includes(p.id) : false;
  });

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.fetchProduct(+productId);
    }
  }

  fetchProduct(id: number): void {
    this.isLoading.set(true);
    this.productsService.fetchProductById(id).pipe(take(1)).subscribe({
      next: (res) => {
        this.product.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Fetching product failed', err);
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/main']);
  }

  toggleFavorite(): void {
    const productId = this.product()?.id;
    if (!productId) return;

    if (this.isFavorite()) {
      this.storageService.removeFavorite(productId);
    } else { 
      this.storageService.addFavorite(productId);
    }
  }

  toggleCart(): void {
    const productId = this.product()?.id;
    if (!productId) return;

    if (this.isInCart()) {
      this.storageService.removeFromCart(productId);
    } else {
      this.storageService.addToCart(productId);
    }
  }
}
