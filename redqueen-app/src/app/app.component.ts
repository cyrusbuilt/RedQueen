import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CoreComponent } from './shared/components/core/core.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends CoreComponent {
  title = 'redqueen-app';

  constructor(public authService: AuthService, private _router: Router) { super(); }

  openUserSettings(): void {
    this._router.navigate(['/user-settings']);
  }

  goToLogin(): void {
    this._router.navigate(['/login']);
  }
}
