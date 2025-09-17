import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products-service/products-service';
import { Product } from '../../core/modules/app-module';


import { take } from 'rxjs/operators';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    NgxSkeletonLoaderModule,
    CommonModule
],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit{

  isLoading = signal<boolean>(true);
  ProductsList = signal<Product[]>([]);
  private productsService = inject(ProductsService); 
  private router = inject(Router);
  
  ngOnInit(): void {
    this.fetchAllProducts();
  }

  fetchAllProducts() {
    this.isLoading.set(true);
    this.productsService.fetchProducts().pipe(take(1)).subscribe({
      next: (res) => {
        this.ProductsList.set(res);
         this.isLoading.set(false);  // set loading false AFTER data set
        console.log('Fetching products successfully');
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log('Fetching products faild',err);
      }
    });
  }

  prodactDetails(id: number) {
    this.router.navigate(['/products', id]);
  }


}
