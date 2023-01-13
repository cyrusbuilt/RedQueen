import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ArdudeskControl } from 'src/app/core/interfaces/ardudesk-control';
import { ArdudeskStatus } from 'src/app/core/interfaces/ardudesk-status';
import { ControlCommand } from 'src/app/core/interfaces/control-command';
import { Device } from 'src/app/core/interfaces/device';

enum ArduDeskCommand {
  DISABLE = 0,
  ENABLE = 1,
  REBOOT = 2,
  REQUEST_STATUS = 3,
  MOVE = 4,
  STOP = 5,
  SIT = 6,
  STAND = 7,
  SET_SITTING_HEIGHT = 8,
  SET_STANDING_HEIGHT = 9
}

enum ArduDeskSystemState {
  BOOTING = 0,
  NORMAL = 1,
  UPDATING = 2,
  DISABLED = 3
}

@Component({
  selector: 'app-ardudesk',
  templateUrl: './ardudesk.component.html',
  styleUrls: ['./ardudesk.component.scss']
})
export class ArdudeskComponent implements OnInit, OnDestroy {
  private _arduDeskSub: Subscription | null;
  private _newSetpoint: number;
  private _setpointChanging: boolean;
  device: Device | null;
  state: ArdudeskStatus | null;
  commands: ControlCommand[];

  constructor(
    private _location: Location,
    private _mqtt: MqttService
  ) {
    this._arduDeskSub = null;
    this._newSetpoint = 0;
    this._setpointChanging = false;
    this.device = null;
    this.state = null;
    this.commands = [
      {
        friendlyName: 'Disable',
        command: ArduDeskCommand.DISABLE
      },
      {
        friendlyName: 'Enable',
        command: ArduDeskCommand.ENABLE
      },
      {
        friendlyName: 'Reboot',
        command: ArduDeskCommand.REBOOT
      },
      {
        friendlyName: 'Request Status',
        command: ArduDeskCommand.REQUEST_STATUS
      },
      {
        friendlyName: 'Move',
        command: ArduDeskCommand.MOVE
      },
      {
        friendlyName: 'Stop',
        command: ArduDeskCommand.STOP
      },
      {
        friendlyName: 'Sit',
        command:ArduDeskCommand.SIT
      },
      {
        friendlyName: 'Stand',
        command: ArduDeskCommand.STAND
      }
    ];
  }

  ngOnInit(): void {
    const devStr = sessionStorage.getItem('integrationDevice');
    if (devStr) {
      this.device = JSON.parse(devStr) as Device;
      if (this.device.statusTopic?.isActive) {
        const topic = this.device.statusTopic.name
        this._arduDeskSub = this._mqtt.observe(topic).subscribe((message: IMqttMessage) => {
          this.state = JSON.parse(message.payload.toString()) as ArdudeskStatus;
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this._arduDeskSub) {
      this._arduDeskSub.unsubscribe();
      this._arduDeskSub = null;
    }
  }

  onBackClick(): void {
    this._location.back();
  }

  getSystemStateName(state: number): string {
    let stateName: string = "Offline";
    switch (state) {
      case ArduDeskSystemState.BOOTING:
        stateName = "Booting";
        break;
      case ArduDeskSystemState.DISABLED:
        stateName = "Disabled";
        break;
      case ArduDeskSystemState.NORMAL:
        stateName = "Normal";
        break;
      case ArduDeskSystemState.UPDATING:
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
      const cmd: ArdudeskControl = {
        clientId: this.state.clientId,
        command: selection.command
      };
      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onDeskAction(event: MatButtonToggleChange): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: ArdudeskControl = {
        clientId: this.state.clientId,
        command: event.value as ArduDeskCommand
      };
      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onHeightSetpointChanged(event: MatSliderChange): void {
    this._newSetpoint = event.value!;
    if (this._newSetpoint < 0 || this._newSetpoint > 256) {
      // Use a sane default in the absence of good data.
      this._newSetpoint = this.state ? this.state.height : 40;
    }

    if (this._setpointChanging) {
      return;
    }

    setTimeout(() => {
      if (this.device?.controlTopic && this.state) {
        const cmd: ArdudeskControl = {
          clientId: this.state.clientId,
          command: ArduDeskCommand.MOVE,
          requestedHeight: this._newSetpoint
        };
        this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
      }
    }, 500);
  }

  onSetSittingHeightClick(): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: ArdudeskControl = {
        clientId: this.state.clientId,
        command: ArduDeskCommand.SET_SITTING_HEIGHT
      };
      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onSetStandingHeightClick(): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: ArdudeskControl = {
        clientId: this.state.clientId,
        command: ArduDeskCommand.SET_STANDING_HEIGHT
      };
      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }
}
