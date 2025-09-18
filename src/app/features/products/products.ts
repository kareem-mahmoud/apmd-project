import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products-service/products-service';
import { ErrorDetails, Product } from '../../core/modules/app-module';


import { take } from 'rxjs/operators';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Error } from "../../shared/error/error";


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    NgxSkeletonLoaderModule,
    CommonModule,
    MatSnackBarModule,
    Error
],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit{

  error = signal<ErrorDetails | null>(null);
  isLoading = signal<boolean>(true);
  searchText = input<string>('');
  ProductsList = signal<Product[]>([]);
  CategoriesList = signal<string[]>([]);
  visibleProducts = signal<Product[]>([]);
  private pageSize = 6;
  private currentIndex = 0;
  private productsService = inject(ProductsService); 
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

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
    this.fetchCategories();
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
        const errorDetails: ErrorDetails = {
          message: 'Failed to load products',
          code: err.status,
          details: err.message,
          action: {
            label: 'Retry',
            handler: () => this.fetchAllProducts()
          }
        };
        this.error.set(errorDetails);
      }
    });
  }


  fetchCategories() {
    this.productsService.fetchCategories().pipe(take(1)).subscribe({
      next: (res) => {
        const categories = res;
        this.CategoriesList.set(['All', ...categories]);
        console.log('Fetching categories successfully');
      },
      error: (err) => {
        const errorDetails: ErrorDetails = {
          message: 'Failed to load categories',
          code: err.status,
          details: err.message,
          action: {
            label: 'Retry',
            handler: () => this.fetchCategories()
          }
        };
        this.error.set(errorDetails);
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

  CategoriesFilter(category: string) {
    if (category === 'All') {
      // Reset to the initial paginated list of all products
      this.currentIndex = 0;
      this.visibleProducts.set([]);
      this.loadMoreProducts();
    } else if (this.CategoriesList().includes(category)) {
      this.isLoading.set(true);
      this.productsService.fetchProductsByCategory(category).pipe(take(1)).subscribe({
        next: (res) => {
          this.currentIndex = this.ProductsList().length;
          this.visibleProducts.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          const snackBarRef = this.snackBar.open(`Failed to load products for '${category}'`, 'Retry', {
            duration: 5000,
          });
          snackBarRef.onAction().subscribe(() => {
            this.CategoriesFilter(category);
          });
        }
      });
    }
  }
}
