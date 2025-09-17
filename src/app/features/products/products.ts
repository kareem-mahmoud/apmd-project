import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
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
  searchText = input<string>('');
  ProductsList = signal<Product[]>([]);
  visibleProducts = signal<Product[]>([]);
  private pageSize = 6;
  private currentIndex = 0;
  private productsService = inject(ProductsService); 
  private router = inject(Router);

  filteredProducts = computed(() => {
    const term = (this.searchText() || '').trim().toLowerCase();
    if (!term) return this.visibleProducts();
    // Filter by product title
    return this.ProductsList().filter((product: Product) => {
      const inTitle = (product.title || '').toLowerCase().includes(term);
      const inDescription = (product.description || '').toLowerCase().includes(term);
      const inCategory = (product.category || '').toLowerCase().includes(term);
      return inTitle || inDescription || inCategory;
    });
  });
  
  ngOnInit(): void {
    this.fetchAllProducts();
  }

  fetchAllProducts() {
    this.isLoading.set(true);
    this.productsService.fetchProducts().pipe(take(1)).subscribe({
      next: (res) => {
        this.ProductsList.set(res);
        this.loadMoreProducts();
        this.isLoading.set(false);  // set loading false AFTER data set
        console.log('Fetching products successfully');
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log('Fetching products faild',err);
      }
    });
  }

  loadMoreProducts() {
    const allProducts = this.ProductsList();
    const nextProducts = allProducts.slice(this.currentIndex, this.currentIndex + this.pageSize);
    this.visibleProducts.set([
      ...this.visibleProducts(),
      ...nextProducts
    ]);
    this.currentIndex += this.pageSize;
  }

  onScrollHandler(event: Event) {
    const target = event.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 5) {
      if (this.currentIndex < this.ProductsList().length) {
        this.loadMoreProducts();
      }
    }
  }

  prodactDetails(id: number) {
    this.router.navigate(['/products', id]);
  }

  sortbyPriceDesc() {
    const sorted = [...this.ProductsList()].sort((a, b) => a.price - b.price);
    if(sorted.length === this.ProductsList().length) {
      this.currentIndex = sorted.length;
      this.visibleProducts.set(sorted);
    }
    
  }
  sortbyPriceAsc() {
    const sorted = [...this.ProductsList()].sort((a, b) => b.price - a.price);
    if(sorted.length === this.ProductsList().length) {
      this.currentIndex = sorted.length;
      this.visibleProducts.set(sorted);
    }
  }

  sortbyTitleDesc() {
    const sorted = [...this.ProductsList()].sort((a, b) => b.title.localeCompare(a.title));
    if(sorted.length === this.ProductsList().length) {
      this.currentIndex = sorted.length;
      this.visibleProducts.set(sorted);
    }
    
  }
  sortbyTitleAsc() {
    const sorted = [...this.ProductsList()].sort((a, b) => a.title.localeCompare(b.title));
    if(sorted.length === this.ProductsList().length) {
      this.currentIndex = sorted.length;
      this.visibleProducts.set(sorted);
    }
  }

}
