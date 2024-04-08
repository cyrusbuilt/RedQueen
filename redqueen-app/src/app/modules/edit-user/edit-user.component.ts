import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/core/interfaces/application-user';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  form: UntypedFormGroup;
  submitted: boolean;
  saved: boolean;
  user: User | null;

  constructor(
    private _fb: UntypedFormBuilder,
    private _location: Location,
    private _router: Router,
    private _authService: AuthService,
    private _toastService: ToastService
  ) {
    this.user = null;
    this.submitted = false;
    this.saved = false;
    this.form = this._fb.group({
      email: ['', [Validators.required, this.customEmailValidator()]],
      firstName: [''],
      lastName: [''],
    });
  }

  ngOnInit(): void {
    let u = sessionStorage.getItem('manageUser');
    if (u) {
      this.user = JSON.parse(u) as User;
      this.form.controls['email'].setValue(this.user.email);
      this.form.controls['firstName'].setValue(this.user.firstName);
      this.form.controls['lastName'].setValue(this.user.lastName);
    }
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
    if (!this.user || this.checkForFormErrors(this.form)) {
      return;
    }

    this.submitted = true;
    this.user.email = this.form.value.email;
    this.user.firstName = this.form.value.firstName;
    this.user.lastName = this.form.value.lastName;

    this._authService.updateRegistration(this.user).subscribe({
      next: value => {
        if (value.status === 'Success') {
          this.saved = true;
          this._toastService.setSuccessMessage("Success!");
          setTimeout(() => { this._router.navigate(['/user-management']); }, 2000);
        }
        else {
          this.saved = false;
          this._toastService.setErrorMessage(`Failed! ${value.message}`);
        }
      }
    });
  }

  onLockUserClick(): void {
    if (this.user) {
      this._authService.enableLockout(this.user).subscribe({
        next: value => {
          if (value.status === 'Success') {
            this.user!.lockoutEnabled = true;
            sessionStorage.setItem('manageUser', JSON.stringify(this.user));
            this._toastService.setSuccessMessage("Success!");
            setTimeout(() => { this.ngOnInit(); });
          }
          else {
            this._toastService.setErrorMessage(`Failed! ${value.message}`);
          }
        }
      });
    }
  }

  onUnlockUserClick(): void {
    if (this.user) {
      this._authService.disableLockout(this.user).subscribe({
        next: value => {
          if (value.status === 'Success') {
            this.user!.lockoutEnabled = false;
            sessionStorage.setItem('manageUser', JSON.stringify(this.user));
            this._toastService.setSuccessMessage("Success!");
            setTimeout(() => { this.ngOnInit(); });
          }
          else {
            this._toastService.setErrorMessage(`Failed! ${value.message}`);
          }
        }
      });
    }
  }

  onBackClick(): void {
    sessionStorage.setItem('manageUser', '');
    this._location.back();
  }
}
