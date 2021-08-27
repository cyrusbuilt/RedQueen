import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UserLogin } from 'src/app/core/interfaces/user-login';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private subject: BehaviorSubject<boolean>;
  loginForm: FormGroup;
  isLoading: Observable<boolean>;
  loader$: Subscription;
  loginFailed: boolean;
  isFormSubmitted: boolean;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) {
    this.loginFailed = false;
    this.isFormSubmitted = false;
    this.subject = new BehaviorSubject<boolean>(false);
    this.isLoading = this.subject.asObservable();
    this.loader$ = this.loaderService.isLoading.subscribe((val: boolean) => this.subject.next(val));
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.authService.didLoginFail.subscribe(status => {
      this.loginFailed = status;
    });
  }

  ngOnDestroy() {
    this.loader$.unsubscribe();
  }

  login(): void {
    this.isFormSubmitted = true;
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      Object.keys(sessionStorage).forEach(key => key !== 'loginResult' ? sessionStorage.removeItem(key) : null);
      this.authService.login(this.loginForm.value as UserLogin);
    }
  }
}
