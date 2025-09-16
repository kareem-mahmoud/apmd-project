
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader();
// }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxSkeletonLoaderModule,
    // TranslateModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  // protected readonly title = signal('Welcome to the APMD Project');
  // private translate = inject(TranslateService)
  isLoading = signal(true);
  data = signal<string>('');

  constructor() {
    // this.translate.setDefaultLang('en');
    // const browserLang = this.translate.getBrowserLang();
    // this.translate.use(browserLang && ['en', 'de'].includes(browserLang) ? browserLang : 'en');
  }


  ngOnInit(): void {

  }

  // switchLanguage(lang: string) {
  //   this.translate.use(lang);
  // }



}
