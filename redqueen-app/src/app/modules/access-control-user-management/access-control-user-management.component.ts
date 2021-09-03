import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessControlUser } from 'src/app/core/interfaces/access-control-user';
import { CardService } from 'src/app/core/services/card.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-access-control-user-management',
  templateUrl: './access-control-user-management.component.html',
  styleUrls: ['./access-control-user-management.component.scss']
})
export class AccessControlUserManagementComponent implements OnInit {
  users: AccessControlUser[];
  curPage: number;
  pageSize: number;
  totalEntries: number;

  constructor(
    private _location: Location,
    private _router: Router,
    private _cardService: CardService,
    private _toastService: ToastService
  ) {
    this.users = [];
    this.curPage = 1;
    this.pageSize = 10;
    this.totalEntries = 0;
  }

  getUsers(): void {
    this._cardService.getCardUsers(this.pageSize, this.curPage).subscribe({
      next: value => {
        this.totalEntries = value.contentSize;
        this.users = value.items;
      }
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  handlePageChange(event: number) {
    this.curPage = event;
    this.getUsers();
  }

  onBackClick(): void {
    this._location.back();
  }

  onActivateOrDeactivateUser(user: AccessControlUser) {
    user.isActive = !user.isActive;
    this._cardService.updateCardUser(user).subscribe({
      next: value => {
        if (value !== null) {
          this.getUsers();
        }
        else {
          this._toastService.setErrorMessage("Failed to update user! Make sure user exists!");
        }
      }
    });
  }

  onAddUserClick(): void {
    this._router.navigate(['/card-management/access-control-user-management/add']);
  }

  onEditUserClick(user: AccessControlUser): void {
    sessionStorage.setItem("manageCardUser", JSON.stringify(user));
    this._router.navigate(['/card-management/access-control-user-management/edit']);
  }
}
