import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Chart, ChartData, ChartDataset } from 'chart.js';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { COLORSDARK } from 'src/app/chartColors';
import { ChartPeriod } from 'src/app/core/enum/chart-period';
import { ControlCommand } from 'src/app/core/interfaces/control-command';
import { CysumpControl } from 'src/app/core/interfaces/cysump-control';
import { CysumpStatus } from 'src/app/core/interfaces/cysump-status';
import { Device } from 'src/app/core/interfaces/device';
import { MqttMessage } from 'src/app/core/interfaces/mqtt-message';
import { HistoricalDataService } from 'src/app/core/services/historical-data.service';

enum CysumpState {
  BOOTING = 0,
  NORMAL = 1,
  UPDATING = 2,
  DISABLED = 3
};

enum CysumpCommand {
  DISABLE = 0,
  ENABLE = 1,
  ACTIVATE = 2,
  DEACTIVATE = 3,
  REBOOT = 4,
  REQUEST_STATUS = 5,
  DISABLE_ALARM = 6,
  ENABLE_ALARM = 7
};

@Component({
  selector: 'app-cysump',
  templateUrl: './cysump.component.html',
  styleUrls: ['./cysump.component.scss']
})
export class CysumpComponent implements OnInit, OnDestroy {
  private _cysumpSub: Subscription | null;
  private _selectedPeriod: ChartPeriod;
  private _refreshInterval: any | null;
  device: Device | null;
  state: CysumpStatus | null;
  commands: ControlCommand[];
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
    this._cysumpSub = null;
    this._selectedPeriod = ChartPeriod.HOUR;
    this._refreshInterval = null;
    this.device = null;
    this.state = null;
    this.historicalMessages = [];
    this.histChart = null;
    this.commands = [
      {
        friendlyName: 'Disable',
        command: CysumpCommand.DISABLE
      },
      {
        friendlyName: 'Enable',
        command: CysumpCommand.ENABLE
      },
      {
        friendlyName: 'Activate',
        command: CysumpCommand.ACTIVATE
      },
      {
        friendlyName: 'Deactivate',
        command: CysumpCommand.DEACTIVATE
      },
      {
        friendlyName: 'Reboot',
        command: CysumpCommand.REBOOT
      },
      {
        friendlyName: 'Request Status',
        command: CysumpCommand.REQUEST_STATUS
      },
      {
        friendlyName: 'Disable Alarm',
        command: CysumpCommand.DISABLE_ALARM
      },
      {
        friendlyName: 'Enable Alarm',
        command: CysumpCommand.ENABLE_ALARM
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
    const msgData = selectedMsgs.map(m => JSON.parse(m.content) as CysumpStatus);

    const depthData: ChartDataset = {
      label: 'Water Depth',
      borderColor: COLORSDARK[0],
      data: msgData.map(d => d.waterDepth),
      fill: false,
      tension: 0.1,
      pointStyle: 'rectRot',
      radius: 7
    };

    historicalDataSet.push(depthData);

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
        this._cysumpSub = this._mqtt.observe(topic).subscribe((message: IMqttMessage) => {
          this.state = JSON.parse(message.payload.toString()) as CysumpStatus;
        });
      }

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

  ngOnDestroy(): void {
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
      this._refreshInterval = null;
    }

    if (this._cysumpSub) {
      this._cysumpSub.unsubscribe();
      this._cysumpSub = null;
    }
  }

  onBackClick(): void {
    this._location.back();
  }

  getStateName(state: number): string {
    let stateName = "Offline";
    switch (state) {
      case CysumpState.BOOTING:
        stateName = "Booting";
        break;
      case CysumpState.DISABLED:
        stateName = "Disabled";
        break;
      case CysumpState.NORMAL:
        stateName = "Normal";
        break;
      case CysumpState.UPDATING:
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
      const cmd: CysumpControl = {
        client_id: this.state.client_id,
        command: selection.command
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onAlarmStateSelect(event: MatButtonToggleChange): void {
    if (this.device?.controlTopic && this.state) {
      const enable = event.value === 'Enable';
      const cmd: CysumpControl = {
        client_id: this.state.client_id,
        command: enable ? CysumpCommand.ENABLE_ALARM : CysumpCommand.DISABLE_ALARM
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onPumpStateSelect(event: MatButtonToggleChange): void {
    if (this.device?.controlTopic && this.state) {
      const start = event.value === 'Start';
      const cmd: CysumpControl = {
        client_id: this.state.client_id,
        command: start ? CysumpCommand.ACTIVATE : CysumpCommand.DEACTIVATE
      };

      this._mqtt.unsafePublish(this.device.controlTopic.name, JSON.stringify(cmd));
    }
  }

  onChartPeriodSelect(event: MatButtonToggleChange): void {
    this._selectedPeriod = event.value as ChartPeriod;
  }
}
