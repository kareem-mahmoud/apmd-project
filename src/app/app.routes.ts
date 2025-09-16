import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'main', loadComponent: () => import('./main/main').then(m => m.Main) },
    { path: 'products', loadComponent: () => import('./features/products/products/products').then(m => m.Products) },
    { path: 'products/:id', loadComponent: () => import('./features/products/product-item/product-item').then(m => m.ProductItem) }, 
];
