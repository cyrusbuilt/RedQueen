import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ControlCommand } from 'src/app/core/interfaces/control-command';
import { RedQueenSystemStatus } from 'src/app/core/interfaces/red-queen-system-status';
import { TelemetryService } from 'src/app/core/services/telemetry.service';
import { SystemTelemetry } from 'src/app/core/interfaces/system-telemetry';
import { environment } from 'src/environments/environment';
import { RedQueenControlCommand } from 'src/app/core/interfaces/red-queen-control-command';
import { ToastService } from 'src/app/core/services/toast.service';

enum SystemStatus {
  NORMAL = 0,
  RESTART = 1,
  SHUTDOWN = 2,
  REQUEST_STATUS = 3
};

enum SystemCommand {
  RESTART = 0,
  SHUTDOWN = 1
};

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit, OnDestroy {
  private _systemSub: Subscription | null;
  commands: ControlCommand[];
  state: RedQueenSystemStatus | null;
  webAppVersion: string = environment.appVersion;
  sysTelemetry: SystemTelemetry | null;

  constructor(
    private _location: Location,
    private _mqtt: MqttService,
    private _telemService: TelemetryService,
    private _toastService: ToastService
  ) {
    this._systemSub = null;
    this.state = null;
    this.sysTelemetry = null;
    this.commands = [
      {
        friendlyName: 'Restart',
        command: SystemCommand.RESTART
      },
      {
        friendlyName: 'Shutdown',
        command: SystemCommand.SHUTDOWN
      }
    ];
  }

  ngOnInit(): void {
    this._telemService.getSystemTelemetry().subscribe({
      next: (value: SystemTelemetry) => {
        if (value) {
          this.sysTelemetry = value;
          this._systemSub = this._mqtt.observe(this.sysTelemetry.daemonStatusTopic)
            .subscribe((message: IMqttMessage) => {
              this.state = JSON.parse(message.payload.toString()) as RedQueenSystemStatus;
            });
        }
        else {
          this._toastService.setErrorMessage("ERROR: Failed to fetch system telemetry!");
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this._systemSub) {
      this._systemSub.unsubscribe();
      this._systemSub = null;
    }
  }

  onBackClick(): void {
    this._location.back();
  }

  getSystemStateName(state: number) {
    let stateName = "Offline";

    switch(state) {
      case SystemStatus.NORMAL:
        stateName = "Normal";
        break;
      case SystemStatus.REQUEST_STATUS:
        stateName = "Request Status";
        break;
      case SystemStatus.RESTART:
        stateName = "Restarting";
        break;
      case SystemStatus.SHUTDOWN:
        stateName = "Shutdown";
        break;
      default:
        break;
    }

    return stateName;
  }

  onOperationSelect(ctrl: any): void {
    const selection = ctrl.value;
    if (this.sysTelemetry && this.sysTelemetry.daemonControlTopic) {
      const cmd: RedQueenControlCommand = {
        sender: 'RedQueenWebApp',
        command: selection.command
      };

      this._mqtt.unsafePublish(this.sysTelemetry.daemonControlTopic, JSON.stringify(cmd));
    }
  }
}
