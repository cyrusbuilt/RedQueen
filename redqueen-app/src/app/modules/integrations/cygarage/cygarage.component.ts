import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ControlCommand } from 'src/app/core/interfaces/control-command';
import { CygarageControl } from 'src/app/core/interfaces/cygarage-control';
import { CygarageStatus } from 'src/app/core/interfaces/cygarage-status';
import { Device } from 'src/app/core/interfaces/device';

enum CygarageState {
  BOOTING = 0,
  NORMAL = 1,
  UPDATING = 2,
  DISABLED = 3
};

enum CygarageCommand {
  DISABLE = 0,
  ENABLE = 1,
  ACTIVATE = 2,
  REBOOT = 3,
  REQUEST_STATUS = 4
};

@Component({
  selector: 'app-cygarage',
  templateUrl: './cygarage.component.html',
  styleUrls: ['./cygarage.component.scss']
})
export class CygarageComponent implements OnInit, OnDestroy {
  private _cygarageSub: Subscription | null;
  device: Device | null;
  state: CygarageStatus | null;
  commands: ControlCommand[];

  constructor(
    private _location: Location,
    private _mqtt: MqttService
  ) {
    this._cygarageSub = null;
    this.device = null;
    this.state = null;
    this.commands = [
      {
        friendlyName: 'Disable',
        command: CygarageCommand.DISABLE
      },
      {
        friendlyName: 'Enable',
        command: CygarageCommand.ENABLE
      },
      {
        friendlyName: 'Reboot',
        command: CygarageCommand.REBOOT
      },
      {
        friendlyName: 'Request Status',
        command: CygarageCommand.REQUEST_STATUS
      }
    ];
  }

  ngOnInit(): void {
    const devStr = sessionStorage.getItem('integrationDevice');
    if (devStr) {
      this.device = JSON.parse(devStr) as Device;
      if (this.device.statusTopic && this.device.statusTopic.isActive) {
        const topic = this.device.statusTopic.name;
        this._cygarageSub = this._mqtt.observe(topic).subscribe((message: IMqttMessage) => {
          this.state = JSON.parse(message.payload.toString()) as CygarageStatus;
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this._cygarageSub) {
      this._cygarageSub.unsubscribe();
    }
  }

  onBackClick(): void {
    this._location.back();
  }

  getStateName(state: number): string {
    let stateName = "Offline";
    switch(state) {
      case CygarageState.BOOTING:
        stateName = "Booting";
        break;
      case CygarageState.DISABLED:
        stateName = "Disabled";
        break;
      case CygarageState.NORMAL:
        stateName = "Normal";
        break;
      case CygarageState.UPDATING:
        stateName = "Updating";
        break;
      default:
        break;
    }

    return stateName;
  }

  onActivate(): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: CygarageControl = {
        client_id: this.state.client_id,
        command: CygarageCommand.ACTIVATE
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onOperationSelect(ctrl: any): void {
    const selection = ctrl.value as ControlCommand;
    if (this.device?.controlTopic && this.state) {
      const cmd: CygarageControl = {
        client_id: this.state.client_id,
        command: selection.command
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }
}
