import { Component, signal, ViewChild } from '@angular/core';
import { Products } from "../features/products/products";
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  imports: [
    Products,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {

  @ViewChild('productList') productList!: Products;
  searchText = signal<string>('');
  
  clearInput() {
    this.searchText.set('');
  }

  PriceAsc() {
    this.productList.sortbyPriceAsc();
  }

  PriceDesc() {
    this.productList.sortbyPriceDesc();
  }

  TitleAsc() {
    this.productList.sortbyTitleAsc();
  }

  TitleDesc() {
    this.productList.sortbyTitleDesc();
  }
}
