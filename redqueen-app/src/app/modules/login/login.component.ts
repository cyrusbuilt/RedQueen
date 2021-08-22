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
      username: ['', Validators.required],
      password: ['', Validators.required]
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

  customEmailValidator(): ValidatorFn {
    const emailRegex = /(?:[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return (control): { [key: string]: any } | null => {
      const forbidden = !control.value.match(emailRegex);
      return forbidden ? { invalid: !forbidden } : null;
    };
  }
}
