import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ControlCommand } from 'src/app/core/interfaces/control-command';
import { Cygate4Control } from 'src/app/core/interfaces/cygate4-control';
import { Cygate4Door, Cygate4Status } from 'src/app/core/interfaces/cygate4-status';
import { Device } from 'src/app/core/interfaces/device';
import { Tile } from 'src/app/core/interfaces/tile';

enum CygateCommand {
  DISABLE = 0,
  ENABLE = 1,
  REBOOT = 2,
  REQUEST_STATUS = 3,
  SET_ARM_STATE = 4,
  LOCK_DOOR = 5,
  UNLOCK_DOOR = 6
}

enum CygateSystemState {
  BOOTING = 0,
  NORMAL = 1,
  UPDATING = 2,
  SYS_DISABLED = 3
}

enum CygateArmState {
  DISARMED = 0,
  ARMED_STAY = 1,
  ARMED_AWAY = 2
}

interface DoorTile extends Tile {
  door: Cygate4Door;
}

@Component({
  selector: 'app-cygate4',
  templateUrl: './cygate4.component.html',
  styleUrls: ['./cygate4.component.scss']
})
export class Cygate4Component implements OnInit, OnDestroy {
  private _cygateSub: Subscription | null;
  device: Device | null;
  state: Cygate4Status | null;
  commands: ControlCommand[];
  doorTiles: DoorTile[];

  constructor(
    private _location: Location,
    private _mqttService: MqttService
  ) {
    this._cygateSub = null;
    this.device = null;
    this.state = null;
    this.doorTiles = [];
    this.commands = [
      {
        friendlyName: 'Disable',
        command: CygateCommand.DISABLE
      },
      {
        friendlyName: 'Enable',
        command: CygateCommand.ENABLE
      },
      {
        friendlyName: 'Reboot',
        command: CygateCommand.REBOOT
      },
      {
        friendlyName: 'Request Status',
        command: CygateCommand.REQUEST_STATUS
      }
    ];
  }

  ngOnInit(): void {
    const devStr = sessionStorage.getItem('integrationDevice');
    if (devStr) {
      this.device = JSON.parse(devStr) as Device;
      if (this.device.statusTopic && this.device.statusTopic.isActive) {
        const topic = this.device.statusTopic.name;
        this._cygateSub = this._mqttService.observe(topic).subscribe((message: IMqttMessage) => {
          this.state = JSON.parse(message.payload.toString()) as Cygate4Status;
          this.state.doors.forEach(d => {
            let tile: DoorTile = {
              text: d.name,
              cols: 1,
              rows: 2,
              color: 'white',
              door: d
            };
            this.doorTiles.push(tile);
          });
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this._cygateSub) {
      this._cygateSub.unsubscribe();
    }
  }

  onBackClick(): void {
    this._location.back();
  }

  getSystemState(state: number): string {
    let sysState = "Offline";
    switch (state) {
      case CygateSystemState.BOOTING:
        sysState = "Booting";
        break;
      case CygateSystemState.NORMAL:
        sysState = "Normal";
        break;
      case CygateSystemState.SYS_DISABLED:
        sysState = "System Disabled";
        break;
      case CygateSystemState.UPDATING:
        sysState = "Updating";
        break;
      default:
        break;
    }

    return sysState;
  }

  getArmState(state: number): string {
    let armState = "Unknown";
    switch (state) {
      case CygateArmState.ARMED_AWAY:
        armState = "Armed Away";
        break;
      case CygateArmState.ARMED_STAY:
        armState = "Armed State";
        break;
      case CygateArmState.DISARMED:
        armState = "Disarmed";
        break;
      default:
        break;
    }

    return armState;
  }

  onOperationSelect(ctrl: any): void {
    const selection = ctrl.value as ControlCommand;
    if (this.device?.controlTopic && this.state) {
      const cmd: Cygate4Control = {
        clientId: this.state.clientId,
        command: selection.command
      };

      this._mqttService.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  // TODO Finish this out.
}
