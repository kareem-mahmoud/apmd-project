
import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxSkeletonLoaderModule
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}
