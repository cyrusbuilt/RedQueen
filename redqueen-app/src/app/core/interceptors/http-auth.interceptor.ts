import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenResponse } from '../interfaces/token-response';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let auth = sessionStorage.getItem('loginResult');
    if (auth) {
      let authResult = JSON.parse(auth) as TokenResponse;
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authResult.token}`
        }
      });
    }
    return next.handle(request);
  }
}
