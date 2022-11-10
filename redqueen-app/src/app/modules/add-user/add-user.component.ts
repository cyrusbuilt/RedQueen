import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRegistration } from 'src/app/core/interfaces/user-registration';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  form: FormGroup;
  submitted: boolean;
  registered: boolean;

  constructor(
    private _location: Location,
    private _router: Router,
    private _fb: FormBuilder,
    private _toastService: ToastService,
    private _authService: AuthService
  ) {
    this.submitted = false;
    this.registered = false;
    this.form = this._fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required, this.customEmailValidator()]],
      phone: ['']
    });
  }

  customEmailValidator(): ValidatorFn {
    const emailRegex = /(?:[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return (control): { [key: string]: any } | null => {
      const forbidden = !control.value.match(emailRegex);
      return forbidden ? { customemail: !forbidden } : null;
    };
  }

  isFieldValid(field: string): boolean {
    let fld = this.form.get(field);
    return !!fld && !fld.valid && fld.touched;
  }

  checkForFormErrors(form: FormGroup): boolean {
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

  onBackClick() {
    this._location.back();
  }

  submit(): void {
    if (this.checkForFormErrors(this.form)) {
      return;
    }

    this.submitted = true;

    let newUser = this.form.value as UserRegistration;
    this._authService.register(newUser).subscribe({
      next: value => {
        if (value.status === 'Success') {
          this.registered = true;
          this._toastService.setSuccessMessage(value.message);
          setTimeout(() => { this._router.navigate(['/user-management'])}, 2000);
        }
        else {
          this.registered = false;
          this._toastService.setErrorMessage(value.message);
        }
      }
    });
  }
}
