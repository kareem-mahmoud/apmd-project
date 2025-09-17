import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { Product } from '../../core/modules/app-module';
import { ProductsService } from '../../core/services/products-service/products-service';

@Component({
  selector: 'app-product-item',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
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
}
