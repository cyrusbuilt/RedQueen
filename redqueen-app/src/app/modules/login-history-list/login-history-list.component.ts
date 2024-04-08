import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/interfaces/application-user';
import { LoginHistory } from 'src/app/core/interfaces/login-history';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-login-history-list',
  templateUrl: './login-history-list.component.html',
  styleUrls: ['./login-history-list.component.scss']
})
export class LoginHistoryListComponent implements OnInit {
  users: User[];
  selectedUser: User | null;
  form: UntypedFormGroup;
  historyList: LoginHistory[];
  curPage: number;
  pageSize: number;
  totalEntries: number;

  constructor(
    private _fb: UntypedFormBuilder,
    private _location: Location,
    private _userService: UserService,
    private _toastService: ToastService
  ) {
    this.users = [];
    this.historyList = [];
    this.selectedUser = null;
    this.curPage = 1;
    this.pageSize = 10;
    this.totalEntries = 0;
    this.form = this._fb.group({
      userSelection: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this._userService.getUserList().subscribe({
      next: value => this.users = value
    });
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

  onSelectUser(): void {
    let selection = this.form.get('userSelection');
    if (selection) {
      this.selectedUser = selection.value as User;
    }
  }

  getHistory(): void {
    const userId = this.form.value.userSelection.id;
    this._userService.getUserLoginHistory(userId, this.pageSize, this.curPage).subscribe({
      next: value => {
        this.totalEntries = value.recordCount;
        this.historyList = value.items;
        this.curPage = value.pageNumber;
        this.pageSize = value.pageSize;
      }
    });
  }

  submit(): void {
    if (!this.selectedUser || this.checkForFormErrors(this.form)) {
      return;
    }

    this.getHistory();
  }

  onBackClick(): void {
    this._location.back();
  }

  handlePageChange(event: number) {
    this.curPage = event;
    this.getHistory();
  }
}
