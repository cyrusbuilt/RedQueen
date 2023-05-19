import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { CylenceControl } from 'src/app/core/interfaces/cylence-control';
import { CylenceStatus } from 'src/app/core/interfaces/cylence-status';
import { ControlCommand } from 'src/app/core/interfaces/control-command';
import { Device } from 'src/app/core/interfaces/device';

enum CylenceCommand {
  DISABLE = 0,
  ENABLE = 1,
	REBOOT = 2,
	REQUEST_STATUS = 3,
	ACTIVATE = 4
}

enum CylenceState {
  BOOTING = 0,
	NORMAL = 1,
	UPDATING = 2,
	DISABLED = 3
}

@Component({
  selector: 'app-cylence',
  templateUrl: './cylence.component.html',
  styleUrls: ['./cylence.component.scss']
})
export class CylenceComponent implements OnInit, OnDestroy {
  private _cylenceSub: Subscription | null;
  device: Device | null;
  state: CylenceStatus | null;
  commands: ControlCommand[];

  constructor(
    private _location: Location,
    private _mqtt: MqttService
  ) {
    this._cylenceSub = null;
    this.device = null;
    this.state = null;
    this.commands = [
      {
        friendlyName: 'Disable',
        command: CylenceCommand.DISABLE
      },
      {
        friendlyName: 'Enable',
        command: CylenceCommand.ENABLE
      },
      {
        friendlyName: 'Reboot',
        command: CylenceCommand.REBOOT
      },
      {
        friendlyName: 'Request Status',
        command: CylenceCommand.REQUEST_STATUS
      }
    ];
  }

  ngOnInit(): void {
    const devStr = sessionStorage.getItem('integrationDevice');
    if (devStr) {
      this.device = JSON.parse(devStr) as Device;
      if (this.device.statusTopic?.isActive) {
        const topic = this.device.statusTopic.name;
        this._cylenceSub = this._mqtt.observe(topic).subscribe((message: IMqttMessage) => {
          this.state = JSON.parse(message.payload.toString()) as CylenceStatus;
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this._cylenceSub) {
      this._cylenceSub.unsubscribe();
      this._cylenceSub = null;
    }
  }

  onBackClick(): void {
    this._location.back();
  }

  getSystemStateName(state: number): string {
    let stateName: string = "Offline";
    switch (state) {
      case CylenceState.BOOTING:
        stateName = "Booting";
        break;
      case CylenceState.DISABLED:
        stateName = "Disabled";
        break;
      case CylenceState.NORMAL:
        stateName = "Normal";
        break;
      case CylenceState.UPDATING:
        stateName = "Updating";
        break;
      default:
        break;
    }

    return stateName;
  }

  onOperationSelect(ctrl: any): void {
    const selection = ctrl.value;
    if (this.device?.controlTopic && this.state) {
      const cmd: CylenceControl = {
        clientId: this.state.clientId,
        command: selection.command
      };
      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onActivate(): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: CylenceControl = {
        clientId: this.state.clientId,
        command: CylenceCommand.ACTIVATE
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }
}
