import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AccessControlUser } from 'src/app/core/interfaces/access-control-user';
import { Card } from 'src/app/core/interfaces/card';
import { CardService } from 'src/app/core/services/card.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-manage-card',
  templateUrl: './manage-card.component.html',
  styleUrls: ['./manage-card.component.scss']
})
export class ManageCardComponent implements OnInit {
  card: Card | null;
  saved: boolean;
  submitted: boolean;
  form: FormGroup;
  selectedUser: AccessControlUser | null;
  users: AccessControlUser[];

  constructor(
    private _fb: FormBuilder,
    private _location: Location,
    private _router: Router,
    private _cardService: CardService,
    private _toastService: ToastService
  ) {
    this.card = null;
    this.saved = false;
    this.submitted = false;
    this.selectedUser = null;
    this.users = [];
    this.form = this._fb.group({
      userSelection: ['']
    });
  }

  ngOnInit(): void {
    const cardStr = sessionStorage.getItem('manageCard');
    if (cardStr) {
      this.card = JSON.parse(cardStr) as Card;
    }

    this._cardService.getActiveUsers().subscribe({
      next: value => this.users = value
    });
  }

  submit(): void {
    if (!this.card) {
      return;
    }

    this.submitted = true;

    if (this.selectedUser) {
      this.card.accessControlUserId = this.selectedUser.id;
      this.card.user = this.selectedUser;
      this._cardService.updateCard(this.card).subscribe({
        next: value => {
          if (value !== null) {
            this.saved = true;
            sessionStorage.setItem('manageCard', '');
            this._toastService.setSuccessMessage("Saved!");
            setTimeout(() => { this._router.navigate(['/card-management']); }, 2000);
          }
          else {
            this.saved = false;
            this._toastService.setErrorMessage("Failed to save card!");
          }
        }
      });
    }
    else {
      this.card.user = undefined;
    }
  }

  onBackClick(): void {
    this._location.back();
  }

  onActivateOrDeactivate(): void {
    if (!this.card) {
      return;
    }

    this.card.isActive = !this.card.isActive;
    this._cardService.updateCard(this.card)
      .pipe(take(1))
      .subscribe({
        next: value => {
          if (value !== null) {
            this.card = value;
            this._toastService.setSuccessMessage("Success!");
          }
          else {
            this._toastService.setErrorMessage("Failed to update card!");
          }
        }
      });
  }

  onSelectUser(): void {
    const sel = this.form.get('userSelection');
    if (sel) {
      this.selectedUser = sel.value as AccessControlUser;
    }
  }
}
