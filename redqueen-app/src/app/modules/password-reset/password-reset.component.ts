import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { PasswordResetRequest } from 'src/app/core/interfaces/password-reset-request';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {
  form: UntypedFormGroup;
  submitted: boolean;

  constructor(
    private _fb: UntypedFormBuilder,
    private _location: Location,
    private _toastService: ToastService,
    private _authService: AuthService,
  ) {
    this.submitted = false;
    this.form = this._fb.group({
      newPassword: ['', Validators.required]
    });
  }

  isFieldValid(field: string) {
    let formItem = this.form.get(field);
    if (!formItem) {
      return false;
    }

    return !formItem.valid && formItem.touched;
  }

  checkForFormErrors(form: UntypedFormGroup): boolean {
    form.markAllAsTouched();

    let returnValue = false;
    for (const prop in form.controls) {
      if (form.controls[prop].errors !== null) {
        returnValue = true;
      }
    }

    if (!!returnValue) {
      this._toastService.setErrorMessage();
    }
    return returnValue;
  }

  submit(): void {
    if (this.checkForFormErrors(this.form)) {
      return;
    }

    this.submitted = true;
    let tokenObj = this._authService.getToken();
    let request = {
      token: tokenObj?.token,
      userId: tokenObj?.userId,
      newPassword: this.form.value.newPassword
    } as PasswordResetRequest;

    this._authService.resetPassword(request)
      .pipe(take(1))
      .subscribe({
        next: value => {
          sessionStorage.setItem('loginResult', JSON.stringify(value));
          this._toastService.setSuccessMessage('Password change successful.');
        },
        error: err => {
          this._toastService.setErrorMessage(`Failed to reset password: ${err}`);
        }
      });
  }

  onBackClick(): void {
    this._location.back();
  }
}
