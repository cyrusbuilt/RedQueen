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

  // TODO Implement MQTT client-side for control/monitor of the RedQueen daemon,
  // as well as individual devices. See https://medium.com/@anant.lalchandani/dead-simple-mqtt-example-over-websockets-in-angular-b9fd5ff17b8e

  constructor(public authService: AuthService, private _router: Router) { super(); }

  openUserSettings(): void {
    this._router.navigate(['/user-settings']);
  }

  logout(): void {
    this.authService.logout();
  }
}
