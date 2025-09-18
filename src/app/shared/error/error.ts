import { Component, Input } from '@angular/core';
import { ErrorDetails } from '../../core/modules/app-module';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.html',
  styleUrl: './error.scss'
})
export class Error {

  @Input({ required: true }) error!: ErrorDetails;
  
  get errorType(): string {
    if (this.error.code === 404) return 'Not Found';
    if (this.error.code === 500) return 'Server Error';
    return 'Unexpected Error';
  }
  
}
