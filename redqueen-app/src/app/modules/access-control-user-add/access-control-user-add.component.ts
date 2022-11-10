import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AccessControlUser } from 'src/app/core/interfaces/access-control-user';
import { CardService } from 'src/app/core/services/card.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-access-control-user-add',
  templateUrl: './access-control-user-add.component.html',
  styleUrls: ['./access-control-user-add.component.scss']
})
export class AccessControlUserAddComponent {
  form: FormGroup;
  submitted: boolean;
  userAdded: boolean;

  constructor(
    private _location: Location,
    private _router: Router,
    private _fb: FormBuilder,
    private _toastService: ToastService,
    private _cardService: CardService
  ) {
    this.submitted = false;
    this.userAdded = false;
    this.form = this._fb.group({
      name: ['', [Validators.required]],
      pin: ['', [Validators.required]]
    });
  }

  onBackClick(): void {
    this._location.back();
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
    if (this.checkForFormErrors(this.form)) {
      return;
    }

    this.submitted = true;

    const user = {
      name: this.form.value.name,
      pin: this.form.value.pin,
      isActive: true
    } as AccessControlUser;

    this._cardService.addCardUser(user)
      .pipe(take(1))
      .subscribe({
        next: value => {
          if (value !== null) {
            this.userAdded = true;
            this._toastService.setSuccessMessage("Saved!");
            setTimeout(() => { this._router.navigate(['/card-management/access-control-user-management']); });
          }
          else {
            this.userAdded = false;
            this._toastService.setErrorMessage("Save failed! Make sure user does not already exist!");
          }
        }
      });
  }
}
