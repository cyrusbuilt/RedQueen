import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ClcontrollerControl } from 'src/app/core/interfaces/clcontroller-control';
import { ClcontrollerStatus } from 'src/app/core/interfaces/clcontroller-status';
import { ControlCommand } from 'src/app/core/interfaces/control-command';
import { Device } from 'src/app/core/interfaces/device';

enum ClControllerState {
  BOOTING = 0,
  NORMAL = 1,
  UPDATING = 2,
  DISABLED = 3
};

enum ClControllerCommand {
  DISABLE = 0,
  ENABLE = 1,
  REBOOT = 2,
  REQUEST_STATUS = 3,
  PAUSE_SEQUENCE = 4,
  PLAY_SEQUENCE = 5,
  ALL_ON = 6,
  ALL_OFF = 7
};

@Component({
  selector: 'app-clcontroller',
  templateUrl: './clcontroller.component.html',
  styleUrls: ['./clcontroller.component.scss']
})
export class ClcontrollerComponent implements OnInit, OnDestroy {
  private _clControllerSub: Subscription | null;
  commands: ControlCommand[];
  device: Device | null;
  state: ClcontrollerStatus | null;

  constructor(
    private _location: Location,
    private _mqtt: MqttService
  ) {
    this._clControllerSub = null;
    this.device = null;
    this.state = null;
    this.commands = [
      {
        friendlyName: 'Disable',
        command: ClControllerCommand.DISABLE
      },
      {
        friendlyName: 'Enable',
        command: ClControllerCommand.ENABLE
      },
      {
        friendlyName: 'Reboot',
        command: ClControllerCommand.REBOOT
      },
      {
        friendlyName: 'Request Status',
        command: ClControllerCommand.REQUEST_STATUS
      },
      {
        friendlyName: 'Pause Sequence',
        command: ClControllerCommand.PAUSE_SEQUENCE
      },
      {
        friendlyName: 'Play Sequence',
        command: ClControllerCommand.PLAY_SEQUENCE
      },
      {
        friendlyName: 'All Lights On',
        command: ClControllerCommand.ALL_ON
      },
      {
        friendlyName: 'All Lights Off',
        command: ClControllerCommand.ALL_OFF
      }
    ];
  }

  ngOnInit(): void {
    const devStr = sessionStorage.getItem('integrationDevice');
    if (devStr) {
      this.device = JSON.parse(devStr) as Device;
      if (this.device.statusTopic && this.device.statusTopic.isActive) {
        const topic = this.device.statusTopic.name;
        this._clControllerSub = this._mqtt.observe(topic).subscribe((message: IMqttMessage) => {
          this.state = JSON.parse(message.payload.toString()) as ClcontrollerStatus;
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this._clControllerSub) {
      this._clControllerSub.unsubscribe();
      this._clControllerSub = null;
    }
  }

  onBackClick(): void {
    this._location.back();
  }

  getStatusName(state: number): string {
    let stateName = "Offline";
    switch (state) {
      case ClControllerState.BOOTING:
        stateName = "Booting";
        break;
      case ClControllerState.DISABLED:
        stateName = "Disabled";
        break;
      case ClControllerState.NORMAL:
        stateName = "Normal";
        break;
      case ClControllerState.UPDATING:
        stateName = "Updating";
        break;
      default:
        break;
    }

    return stateName;
  }

  onPlayPauseSlideToggle(event: MatSlideToggleChange): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: ClcontrollerControl = {
        client_id: this.state.client_id,
        command: event.checked ? ClControllerCommand.PLAY_SEQUENCE : ClControllerCommand.PAUSE_SEQUENCE
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onAllLightsSlideToggle(event: MatSlideToggleChange): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: ClcontrollerControl = {
        client_id: this.state.client_id,
        command: event.checked ? ClControllerCommand.ALL_ON : ClControllerCommand.ALL_OFF
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onOperationSelect(ctrl: any): void {
    const selection = ctrl.value;
    if (this.device?.controlTopic && this.state) {
      const cmd: ClcontrollerControl = {
        client_id: this.state.client_id,
        command: selection.command
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }
}
