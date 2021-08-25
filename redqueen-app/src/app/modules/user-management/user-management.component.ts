import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationUser } from 'src/app/core/interfaces/application-user';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: ApplicationUser[];

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
}
