import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AccessControlUser } from 'src/app/core/interfaces/access-control-user';
import { Card } from 'src/app/core/interfaces/card';
import { CardService } from 'src/app/core/services/card.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {
  form: UntypedFormGroup;
  submitted: boolean;
  cardAdded: boolean;
  selectedUser: AccessControlUser | null;
  users: AccessControlUser[];

  constructor(
    private _fb: UntypedFormBuilder,
    private _location: Location,
    private _router: Router,
    private _toastService: ToastService,
    private _cardService: CardService
  ) {
    this.submitted = false;
    this.cardAdded = false;
    this.selectedUser = null;
    this.users = [];
    this.form = this._fb.group({
      serial: ['', Validators.required],
      userSelection: ['']
    });
  }

  ngOnInit(): void {
    this._cardService.getActiveUsers().subscribe({
      next: value => this.users = value
    });
  }

  isFieldValid(field: string): boolean {
    const fld = this.form.get(field);
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

  onSelectUser(): void {
    const sel = this.form.get('userSelection');
    if (sel) {
      this.selectedUser = sel.value as AccessControlUser;
    }
  }

  submit(): void {
    if (this.checkForFormErrors(this.form)) {
      return;
    }

    this.submitted = true;

    const c = {
      serial: this.form.value.serial,
      user: this.form.value.userselection,
      accessControlUserId: this.form.value.userSelection?.id
    } as Card;

    this._cardService.addCard(c)
      .pipe(take(1))
      .subscribe({
        next: value => {
          if (value !== null) {
            this.cardAdded = true;
            this._toastService.setSuccessMessage("Saved!");
            setTimeout(() => { this._router.navigate(['/card-management']); }, 2000);
          }
          else {
            this.cardAdded = false;
            this._toastService.setErrorMessage("Failed to add card! Make sure serial number does not already exist");
          }
        }
      });
  }

  onBackClick(): void {
    this._location.back();
  }
}
