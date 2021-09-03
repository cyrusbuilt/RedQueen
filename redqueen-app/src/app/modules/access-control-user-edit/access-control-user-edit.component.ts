import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AccessControlUser } from 'src/app/core/interfaces/access-control-user';
import { CardService } from 'src/app/core/services/card.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-access-control-user-edit',
  templateUrl: './access-control-user-edit.component.html',
  styleUrls: ['./access-control-user-edit.component.scss']
})
export class AccessControlUserEditComponent implements OnInit {
  form: FormGroup;
  submitted: boolean;
  saved: boolean;
  user: AccessControlUser | null;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _location: Location,
    private _toastService: ToastService,
    private _cardService: CardService
  ) {
    this.submitted = false;
    this.saved = false;
    this.user = null;
    this.form = this._fb.group({
      pin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userStr = sessionStorage.getItem('manageCardUser');
    if (userStr) {
      this.user = JSON.parse(userStr) as AccessControlUser;
      this.form.controls['pin'].setValue(this.user.pin);
    }
  }

  isFieldValid(field: string): boolean {
    const fld = this.form.get(field);
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

  submit(): void {
    if (!this.user || this.checkForFormErrors(this.form)) {
      return;
    }

    this.submitted = true;

    this.user.pin = this.form.value.pin;
    this._cardService.updateCardUser(this.user)
      .pipe(take(1))
      .subscribe({
        next: value => {
          if (value !== null) {
            this.saved = true;
            sessionStorage.setItem('manageCardUser', '');
            this._toastService.setSuccessMessage("Saved!");
            setTimeout(() => { this._router.navigate(['/card-management/access-control-user-management']); });
          }
          else {
            this.saved = false;
            this._toastService.setErrorMessage("Failed to save changes!");
          }
        }
      });
  }

  onBackClick(): void {
    this._location.back();
  }
}
