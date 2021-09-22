import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ControlCommand } from 'src/app/core/interfaces/control-command';
import { Device } from 'src/app/core/interfaces/device';
import { EspstatControl } from 'src/app/core/interfaces/espstat-control';
import { EspstatStatus } from 'src/app/core/interfaces/espstat-status';

enum HvacMode {
  OFF = 0,
  COOL = 1,
  HEAT = 2,
  FANONLY = 3
};

enum EspstatCommand {
  DISABLE = 0,
  ENABLE = 1,
  REBOOT = 2,
  REQUEST_STATUS = 3,
  IO_RESET = 4,
  SET_MODE = 5,
  SET_TEMP = 6
};

enum EspstatState {
  BOOTING = 0,
  NORMAL = 1,
  DISABLED = 2,
  UPDATING = 3
};

@Component({
  selector: 'app-espstat',
  templateUrl: './espstat.component.html',
  styleUrls: ['./espstat.component.scss']
})
export class EspstatComponent implements OnInit, OnDestroy {
  private _espstatSub: Subscription | null;
  private _setpointChanging: boolean;
  private _newSetpoint: number;
  device: Device | null;
  commands: ControlCommand[];
  state: EspstatStatus | null;

  constructor(
    private _location: Location,
    private _mqtt: MqttService
  ) {
    this._newSetpoint = 0;
    this._setpointChanging = false;
    this._espstatSub = null;
    this.device = null;
    this.state = null;
    this.commands = [
      {
        friendlyName: 'Disable',
        command: EspstatCommand.DISABLE
      },
      {
        friendlyName: 'Enable',
        command: EspstatCommand.ENABLE
      },
      {
        friendlyName: 'Reboot',
        command: EspstatCommand.REBOOT
      },
      {
        friendlyName: 'Request Status',
        command: EspstatCommand.REQUEST_STATUS
      },
      {
        friendlyName: 'I/O Reset',
        command: EspstatCommand.IO_RESET
      }
    ];
  }

  ngOnInit(): void {
    const devStr = sessionStorage.getItem('integrationDevice');
    if (devStr) {
      this.device = JSON.parse(devStr) as Device;
      if (this.device.statusTopic && this.device.statusTopic.isActive) {
        const topic = this.device.statusTopic.name;
        this._espstatSub = this._mqtt.observe(topic).subscribe((message: IMqttMessage) => {
          this.state = JSON.parse(message.payload.toString()) as EspstatStatus;
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this._espstatSub) {
      this._espstatSub.unsubscribe();
      this._espstatSub = null;
    }
  }

  onBackClick(): void {
    this._location.back();
  }

  getStateName(state: number): string {
    let stateName = "Offline";
    switch (state) {
      case EspstatState.BOOTING:
        stateName = "Booting";
        break;
      case EspstatState.DISABLED:
        stateName = "Disabled";
        break;
      case EspstatState.NORMAL:
        stateName = "Normal";
        break;
      case EspstatState.UPDATING:
        stateName = "Updating";
        break;
      default:
        break;
    }

    return stateName;
  }

  getModeName(mode: number): string {
    let modeName = "Unknown";
    switch (mode) {
      case HvacMode.COOL:
        modeName = "Cool";
        break;
      case HvacMode.FANONLY:
        modeName = "Fan Only";
        break;
      case HvacMode.HEAT:
        modeName = "Heat";
        break;
      case HvacMode.OFF:
        modeName = "Off";
        break;
      default:
        break;
    }

    return modeName;
  }

  onOperationSelect(ctrl: any): void {
    const selection = ctrl.value;
    if (this.device?.controlTopic && this.state) {
      const cmd: EspstatControl = {
        client_id: this.state.client_id,
        command: selection.command
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onModeSelect(event: MatButtonToggleChange): void {
    if (this.device?.controlTopic && this.state) {
      const cmd: EspstatControl = {
        client_id: this.state.client_id,
        command: EspstatCommand.SET_MODE,
        mode: event.value as HvacMode
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onSetpointChange(event: MatSliderChange): void {
    this._newSetpoint = event.value!;
    if (this._newSetpoint < 50 || this._newSetpoint > 90) {
      // Use a sane default in the absence of good data.
      this._newSetpoint = this.state ? this.state.setpoint : 72;
    }

    if (this._setpointChanging) {
      return;
    }

    setTimeout(() => {
      if (this.device?.controlTopic && this.state) {
        const cmd: EspstatControl = {
          client_id: this.state.client_id,
          command: EspstatCommand.SET_TEMP,
          setPoint: this._newSetpoint
        };

        this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
      }

      this._setpointChanging = false;
    }, 1000);
  }
}
