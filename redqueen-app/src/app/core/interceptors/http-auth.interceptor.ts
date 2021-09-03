import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Set the bearer token if we have one.
    let authResult = this._authService.getToken();
    if (authResult) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authResult.token}`
        }
      });
    }

    // On 401 (auth failed), clear out all session data and redirect to login page.
    return next.handle(request).pipe(tap(() => {},
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
            return;
          }

          this._authService.logout();
        }
      }));
  }
}
