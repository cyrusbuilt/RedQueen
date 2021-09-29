import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { Chart, ChartData, ChartDataset } from 'chart.js';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ControlCommand } from 'src/app/core/interfaces/control-command';
import { Device } from 'src/app/core/interfaces/device';
import { EspstatControl } from 'src/app/core/interfaces/espstat-control';
import { EspstatStatus } from 'src/app/core/interfaces/espstat-status';
import { MqttMessage } from 'src/app/core/interfaces/mqtt-message';
import { HistoricalDataService } from 'src/app/core/services/historical-data.service';
import { COLORSDARK } from 'src/app/chartColors';
import { ChartPeriod } from 'src/app/core/enum/chart-period';

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
  private _refreshInterval: any | null;
  private _selectedPeriod: ChartPeriod;
  device: Device | null;
  commands: ControlCommand[];
  state: EspstatStatus | null;
  historicalMessages: MqttMessage[];
  histChart: Chart | null;
  lineChartOptions = {
    legend: {
      display: true,
      position: 'right'
    }
  };

  constructor(
    private _location: Location,
    private _mqtt: MqttService,
    private _historicalData: HistoricalDataService
  ) {
    this._newSetpoint = 0;
    this._setpointChanging = false;
    this._espstatSub = null;
    this._refreshInterval = null;
    this._selectedPeriod = ChartPeriod.HOUR;
    this.device = null;
    this.state = null;
    this.historicalMessages = [];
    this.histChart = null;
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

  generateHistoricalChartData(): void {
    let historicalDataSet: ChartDataset[] = [];
    let selectedMsgs: MqttMessage[] = [];

    const now = new Date();
    let val = new Date(now.getTime());
    switch (this._selectedPeriod) {
      case ChartPeriod.DAY:
        val.setHours(val.getHours() - 24);
        break;
      case ChartPeriod.HOUR:
        val.setHours(val.getHours() - 1);
        break;
      case ChartPeriod.WEEK:
        val.setHours(val.getHours() - 168);
        break;
      default:
        break;
    }

    selectedMsgs = this.historicalMessages.filter(s => s.timestamp >= val && s.timestamp < now);
    const msgData = selectedMsgs.map(m => JSON.parse(m.content) as EspstatStatus);

    const tempData: ChartDataset = {
      label: 'Temperature',
      borderColor: COLORSDARK[0],
      data: msgData.map(t => t.tempF),
      fill: false,
      tension: 0.1,
      pointStyle: 'rectRot',
      radius: 7
    };

    const humidityData: ChartDataset = {
      label: 'Humidity',
      borderColor: COLORSDARK[1],
      data: msgData.map(h => h.humidity),
      fill: false,
      tension: 0.1,
      pointStyle: 'rectRot',
      radius: 7
    };

    const heatIndexData: ChartDataset = {
      label: 'Heat Index',
      borderColor: COLORSDARK[2],
      data: msgData.map(i => i.heatIndexF),
      fill: false,
      tension: 0.1,
      pointStyle: 'rectRot',
      radius: 7
    };

    historicalDataSet.push(tempData);
    historicalDataSet.push(humidityData);
    historicalDataSet.push(heatIndexData);

    this.histChart = {
      data: {
        datasets: historicalDataSet
      } as ChartData
    } as Chart;
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

        this._refreshInterval ??= setInterval(() => {
          this._historicalData.getHistoricalMessages(this.device!.statusTopicId, 7).subscribe({
            next: value => {
              this.historicalMessages = value;
              this.generateHistoricalChartData();
            }
          });
        }, 5000);
      }
    }
  }

  ngOnDestroy(): void {
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
      this._refreshInterval = null;
    }

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

  onChartPeriodSelect(event: MatButtonToggleChange): void {
    this._selectedPeriod = event.value as ChartPeriod;
  }
}
