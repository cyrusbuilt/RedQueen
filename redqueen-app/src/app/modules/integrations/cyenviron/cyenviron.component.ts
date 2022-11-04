import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ControlCommand } from 'src/app/core/interfaces/control-command';
import { CyenvironControl } from 'src/app/core/interfaces/cyenviron-control';
import { CyenvironStatus } from 'src/app/core/interfaces/cyenviron-status';
import { Device } from 'src/app/core/interfaces/device';

enum CyenvironCommand {
  DISABLE = 0,
  ENABLE = 1,
  REBOOT = 2,
  REQUEST_STATUS = 3,
  SILENCE_ALARM = 4
}

enum CyenvironState {
  BOOTING = 0,
  NORMAL = 1,
  UPDATING = 2,
  DISABLED = 3,
  ALARM = 4
}

enum AirQualityIndex {
  EXCELLENT = 0,
  GOOD = 1,
  LIGHTLY_POLLUTED = 2,
  MODERATELY_POLLUTED = 3,
  HEAVILY_POLLUTED = 4,
  SEVERELY_POLLUTED = 5,
  EXTREME_POLLUTION = 6
}

enum LightLevel {
  DARK = 0,
  DIM = 1,
  LIGHT = 2,
  BRIGHT = 3,
  VERY_DARK = 4
}

@Component({
  selector: 'app-cyenviron',
  templateUrl: './cyenviron.component.html',
  styleUrls: ['./cyenviron.component.scss']
})
export class CyenvironComponent implements OnInit, OnDestroy {
  private _cyEnvironSub: Subscription | null;
  device: Device | null;
  state: CyenvironStatus | null;
  commands: ControlCommand[];

  constructor(
    private _location: Location,
    private _mqtt: MqttService
  ) {
    this._cyEnvironSub = null;
    this.device = null;
    this.state = null;
    this.commands = [
      {
        friendlyName: 'Disable',
        command: CyenvironCommand.DISABLE
      },
      {
        friendlyName: 'Enable',
        command: CyenvironCommand.ENABLE
      },
      {
        friendlyName: 'Reboot',
        command: CyenvironCommand.REBOOT
      },
      {
        friendlyName: 'Request Status',
        command: CyenvironCommand.REQUEST_STATUS
      },
      {
        friendlyName: 'Silence Alarm',
        command: CyenvironCommand.SILENCE_ALARM
      }
    ];
  }

  ngOnInit(): void {
    const devStr = sessionStorage.getItem('integrationDevice');
    if (devStr) {
      this.device = JSON.parse(devStr) as Device;
      if (this.device.statusTopic && this.device.statusTopic.isActive) {
        const topic = this.device.statusTopic.name;
        this._cyEnvironSub = this._mqtt.observe(topic).subscribe((message: IMqttMessage) => {
          this.state = JSON.parse(message.payload.toString()) as CyenvironStatus;
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this._cyEnvironSub) {
      this._cyEnvironSub.unsubscribe();
    }
  }

  onBackClick(): void {
    this._location.back();
  }

  getStateName(state: number): string {
    let stateName: string = "Offline";
    switch (state) {
      case CyenvironState.ALARM:
        stateName = "Alarm";
        break;
      case CyenvironState.BOOTING:
        stateName = "Booting";
        break;
      case CyenvironState.DISABLED:
        stateName = "Disabled";
        break;
      case CyenvironState.NORMAL:
        stateName = "Normal";
        break;
      case CyenvironState.UPDATING:
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
      const cmd: CyenvironControl = {
        client_id: this.state.clientId,
        command: selection.command
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  getAirQualityIndexLabel(index: number): string {
    let indexLabel: string = "Unknown";
    switch (index) {
      case AirQualityIndex.EXCELLENT:
        indexLabel = "Excellent";
        break;
      case AirQualityIndex.GOOD:
        indexLabel = "Good";
        break;
      case AirQualityIndex.MODERATELY_POLLUTED:
        indexLabel = "Moderate Pollution";
        break;
      case AirQualityIndex.HEAVILY_POLLUTED:
        indexLabel = "HEAVILY POLLUTED!";
        break;
      case AirQualityIndex.SEVERELY_POLLUTED:
        indexLabel = "SEVERELY POLLUTED!";
        break;
      case AirQualityIndex.EXTREME_POLLUTION:
        indexLabel = "EXTREMELY POLLUTED!";
        break;
      default:
        break;
    }

    return indexLabel;
  }

  getLightLevelLabel(level: number): string {
    let levelLabel: string = "Unknown";
    switch (level) {
      case LightLevel.VERY_DARK:
        levelLabel = "Very Dark";
        break;
      case LightLevel.DARK:
        levelLabel = "Dark";
        break;
      case LightLevel.DIM:
        levelLabel = "Dim";
        break;
      case LightLevel.LIGHT:
        levelLabel = "Light";
        break;
      case LightLevel.BRIGHT:
        levelLabel = "Bright";
        break;
      default:
        break;
    }

    return levelLabel;
  }
}
