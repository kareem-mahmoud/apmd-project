import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDetails } from '../../modules/app-module';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private snackBar: MatSnackBar) {}

  handleError(error: Error | HttpErrorResponse): void {
    let errorDetails: ErrorDetails;

    if (error instanceof HttpErrorResponse) {
      // HTTP Error handling
      errorDetails = this.handleHttpError(error);
    } else {
      // Client-side or unexpected errors
      errorDetails = this.handleClientError(error);
    }

    // Log error (you can integrate with logging service)
    console.error('Global Error Handler:', errorDetails);

    // Optionally, show error notification or redirect
    this.displayErrorToUser(errorDetails);
  }

  private handleHttpError(error: HttpErrorResponse): ErrorDetails {
    let message = 'An unexpected error occurred';
    let details = '';

    switch (error.status) {
      case 0:
        message = 'No internet connection';
        details = 'Please check your network';
        break;
      case 400:
        message = 'Bad Request';
        details = error.error?.message || 'Invalid request parameters';
        break;
      case 401:
        message = 'Unauthorized';
        details = 'Please log in again';
        break;
      case 403:
        message = 'Forbidden';
        details = 'You do not have permission';
        break;
      case 404:
        message = 'Resource Not Found';
        details = error.url ? `Cannot find ${error.url}` : 'The requested resource does not exist';
        break;
      case 500:
        message = 'Internal Server Error';
        details = 'Something went wrong on our end';
        break;
      default:
        message = error.message || 'Unknown error';
    }

    return {
      message,
      code: error.status,
      details,
      action: {
        label: 'Retry',
        handler: () => window.location.reload()
      }
    };
  }

  private handleClientError(error: Error): ErrorDetails {
    return {
      message: error.message || 'An unexpected client-side error occurred',
      details: error.stack,
      action: {
        label: 'Reload',
        handler: () => window.location.reload()
      }
    };
  }

  private displayErrorToUser(errorDetails: ErrorDetails) {
      this.snackBar.open(
      errorDetails.message,
      errorDetails.action?.label || 'Close',
      {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    ).onAction().subscribe(() => {
      if (errorDetails.action?.handler) {
        errorDetails.action.handler();
      }
    });
  }
}