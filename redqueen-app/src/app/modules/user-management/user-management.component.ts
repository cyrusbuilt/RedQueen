import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/interfaces/application-user';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[];

  constructor(
    private _userService: UserService,
    private _router: Router
  ) {
    this.users = [];
  }

  ngOnInit(): void {
    this._userService.getUserList().subscribe({
      next: value => this.users = value
    });
  }

  onAddUser(): void {
    this._router.navigate(['/user-management/add']);
  }

  onManageClick(user: User): void {
    sessionStorage.setItem('manageUser', JSON.stringify(user));
    this._router.navigate(['/user-management/edit']);
  }
}
