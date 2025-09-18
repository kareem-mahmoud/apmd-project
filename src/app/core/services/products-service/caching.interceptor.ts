import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

// In-memory cache store
const cache = new Map<string, { response: HttpResponse<any>; expiry: number }>();
// Time-to-live for cache entries in milliseconds (e.g., 5 minutes)
const CACHE_TTL = 300000;

export const cachingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Only apply caching to GET requests for single product details
  if (req.method !== 'GET' || !req.url.match(/\/products\/\d+$/)) {
    return next(req);
  }

  const cachedEntry = cache.get(req.urlWithParams);
  if (cachedEntry && cachedEntry.expiry > Date.now()) {
    console.log(`[Cache] Returning cached response for ${req.urlWithParams}`);
    return of(cachedEntry.response.clone());
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        console.log(`[Cache] Caching new response for ${req.urlWithParams}`);
        const expiry = Date.now() + CACHE_TTL;
        cache.set(req.urlWithParams, { response: event.clone(), expiry });
      }
    })
  );
};
