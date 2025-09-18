import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

export const loggingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const startTime = Date.now();
  console.log(`[Request] --> ${req.method} ${req.urlWithParams}`);

  return next(req).pipe(
    finalize(() => {
      const duration = Date.now() - startTime;
      console.log(`[Response] <-- ${req.method} ${req.urlWithParams} took ${duration}ms`);
    })
  );
};
