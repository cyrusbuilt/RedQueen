import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatLegacySlideToggleChange as MatSlideToggleChange } from '@angular/material/legacy-slide-toggle';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { CylightsControl } from 'src/app/core/interfaces/cylights-control';
import { CylightsStatus } from 'src/app/core/interfaces/cylights-status';
import { Device } from 'src/app/core/interfaces/device';
import { ControlCommand } from 'src/app/core/interfaces/control-command';

enum CylightsCommand {
  DISABLE = 0,
  ENABLE = 1,
  REBOOT = 2,
  REQUEST_STATUS = 3,
  LIGHT_1_ON = 4,
  LIGHT_1_OFF = 5,
  LIGHT_2_ON = 6,
  LIGHT_2_OFF = 7,
  LIGHT_3_ON = 8,
  LIGHT_3_OFF = 9,
  LIGHT_4_ON = 10,
  LIGHT_4_OFF = 11,
  LIGHT_5_ON = 12,
  LIGHT_5_OFF = 13,
  ALL_ON = 14,
  ALL_OFF = 15,
  IO_RESET = 16
};

enum CylightsState {
  BOOTING = 0,
  NORMAL = 1,
  UPDATING = 2,
  RECONNECTING = 3,
  DISABLED = 4,
  CHECK_IN = 5
};

@Component({
  selector: 'app-cylights',
  templateUrl: './cylights.component.html',
  styleUrls: ['./cylights.component.scss']
})
export class CylightsComponent implements OnInit, OnDestroy {
  private _cylightsSub: Subscription | null;
  device: Device | null;
  state: CylightsStatus | null;
  commands: ControlCommand[];
  isOutlet1On: boolean;
  isOutlet2On: boolean;
  isOutlet3On: boolean;
  isOutlet4On: boolean;
  isOutlet5On: boolean;

  constructor(
    private _location: Location,
    private _mqtt: MqttService
  ) {
    this._cylightsSub = null;
    this.device = null;
    this.state = null;
    this.commands = [
      {
        friendlyName: 'Disable',
        command: CylightsCommand.DISABLE
      },
      {
        friendlyName: 'Enable',
        command: CylightsCommand.ENABLE
      },
      {
        friendlyName: 'Reboot',
        command: CylightsCommand.REBOOT
      },
      {
        friendlyName: 'Request Status',
        command: CylightsCommand.REQUEST_STATUS
      },
      {
        friendlyName: 'I/O Reset',
        command: CylightsCommand.IO_RESET
      }
    ];
    this.isOutlet1On = false;
    this.isOutlet2On = false;
    this.isOutlet3On = false;
    this.isOutlet4On = false;
    this.isOutlet5On = false;
  }

  ngOnInit(): void {
    const devStr = sessionStorage.getItem('integrationDevice');
    if (devStr) {
      this.device = JSON.parse(devStr) as Device;
      if (this.device.statusTopic && this.device.statusTopic.isActive) {
        const topic = this.device.statusTopic.name;
        this._cylightsSub = this._mqtt.observe(topic).subscribe((message: IMqttMessage) => {
          this.state = JSON.parse(message.payload.toString()) as CylightsStatus;
          this.isOutlet1On = this.state.light1State === 1;
          this.isOutlet2On = this.state.light2State === 1;
          this.isOutlet3On = this.state.light3State === 1;
          this.isOutlet4On = this.state.light4State === 1;
          this.isOutlet5On = this.state.light5State === 1;
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this._cylightsSub) {
      this._cylightsSub.unsubscribe();
    }
  }

  onBackClick(): void {
    this._location.back();
  }

  getStateName(state: number): string {
    let stateName = "Offline";
    switch (state) {
      case CylightsState.BOOTING:
        stateName = "Booting";
        break;
      case CylightsState.NORMAL:
        stateName = "Normal";
        break;
      case CylightsState.UPDATING:
        stateName = "Updating";
        break;
      case CylightsState.RECONNECTING:
        stateName = "Reconnecting";
        break;
      case CylightsState.DISABLED:
        stateName = "Disabled";
        break;
      case CylightsState.CHECK_IN:
        stateName = "Check-in";
        break;
      default:
        break;
    }

    return stateName;
  }

  getOutletState(state: number): string {
    let stateName = "Unknown";
    switch(state) {
      case 0:
        stateName = "Off";
        break;
      case 1:
        stateName = "On";
        break;
      default:
        break;
    }

    return stateName;
  }

  onLight1Clicked(event: MatSlideToggleChange): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: CylightsControl = {
        client_id: this.state.client_id,
        command: event.checked ? CylightsCommand.LIGHT_1_ON : CylightsCommand.LIGHT_1_OFF
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onLight2Clicked(event: MatSlideToggleChange): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: CylightsControl = {
        client_id: this.state.client_id,
        command: event.checked ? CylightsCommand.LIGHT_2_ON : CylightsCommand.LIGHT_2_OFF
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onLight3Clicked(event: MatSlideToggleChange): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: CylightsControl = {
        client_id: this.state.client_id,
        command: event.checked ? CylightsCommand.LIGHT_3_ON : CylightsCommand.LIGHT_3_OFF
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onLight4Clicked(event: MatSlideToggleChange): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: CylightsControl = {
        client_id: this.state.client_id,
        command: event.checked ? CylightsCommand.LIGHT_4_ON : CylightsCommand.LIGHT_4_OFF
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onLight5Clicked(event: MatSlideToggleChange): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: CylightsControl = {
        client_id: this.state.client_id,
        command: event.checked ? CylightsCommand.LIGHT_5_ON : CylightsCommand.LIGHT_5_OFF
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onAllLightsClicked(event: MatSlideToggleChange): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: CylightsControl = {
        client_id: this.state.client_id,
        command: event.checked ? CylightsCommand.ALL_ON : CylightsCommand.ALL_OFF
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onOperationSelect(ctrl: any): void {
    const selection = ctrl.value;
    if (this.device?.controlTopic && this.state) {
      const cmd: CylightsControl = {
        client_id: this.state.client_id,
        command: selection.command
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }
}
