import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserLogin } from '../interfaces/user-login';
import { TokenResponse } from '../interfaces/token-response';
import { UserRegistration } from '../interfaces/user-registration';
import { AuthenticationResponse } from '../interfaces/authentication-response';
import { Router } from '@angular/router';
import { PasswordResetRequest } from '../interfaces/password-reset-request';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private rootUrl: string = environment.rootUrl;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!this.getToken());
  private loginFailed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    if (!this.getToken()) {
      AuthService.resetToken();
    }
  }

  private static resetToken(): void {
    sessionStorage.removeItem('loginResult');
  }

  private static clearSession(): void {
    sessionStorage.clear();
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get didLoginFail(): Observable<boolean> {
    return this.loginFailed.asObservable();
  }

  get username(): string | null {
    return sessionStorage.getItem('username');
  }

  getToken(): TokenResponse | null {
    let result = sessionStorage.getItem('loginResult');
    if (result) {
      return JSON.parse(result) as TokenResponse;
    }

    return null;
  }

  login(login: UserLogin): void {
    this.http.post<TokenResponse>(`${this.rootUrl}/auth/login`, login)
      .pipe(take(1))
      .subscribe(
        res => {
          sessionStorage.setItem('username', login.username);
          sessionStorage.setItem('loginResult', JSON.stringify(res));
          this.loginFailed.next(false);
          this.loggedIn.next(true);
          this.router.navigate(['/']);
        },
        err => {
          AuthService.resetToken();
          this.loginFailed.next(true);
        }
      );
  }

  logout(): void {
    AuthService.clearSession();
    this.loggedIn.next(false);
    this.loginFailed.next(false);
    this.router.navigate(['/login']);
  }

  register(registration: UserRegistration): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.rootUrl}/auth/register`, registration);
  }

  registerAdmin(registration: UserRegistration): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.rootUrl}/auth/register-admin`, registration);
  }

  resetPassword(request: PasswordResetRequest): Observable<TokenResponse> {
    return this.http.put<TokenResponse>(`${this.rootUrl}/api/auth/password-reset`, request);
  }
}
