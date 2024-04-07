import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { User } from 'src/app/core/interfaces/application-user';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  user: User | null;

  constructor(
    public authService: AuthService,
    private _userService: UserService,
    private _router: Router
  ) {
    this.user = null;
  }

  ngOnInit(): void {
    let authResult = this.authService.getToken();
    if (authResult) {
      this._userService.getUser(authResult.userId)
        .pipe(take(1))
        .subscribe({
          next: user => {
            this.user = user;
            sessionStorage.setItem('userInfo', JSON.stringify(this.user));
          }
        });
    }
  }

  resetPassword(): void {
    this._router.navigate(['/password-reset']);
  }

  loginHistory(): void {
    this._router.navigate(['/login/history']);
  }
}
