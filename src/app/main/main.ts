import { Component } from '@angular/core';
import { Products } from "../features/products/products/products";

@Component({
  selector: 'app-main',
  imports: [Products],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {

}
