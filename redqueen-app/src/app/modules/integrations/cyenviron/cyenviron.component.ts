import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ChartData, ChartDataset } from 'chart.js';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { COLORSDARK } from 'src/app/chartColors';
import { ChartPeriod } from 'src/app/core/enum/chart-period';
import { ControlCommand } from 'src/app/core/interfaces/control-command';
import { CyenvironControl } from 'src/app/core/interfaces/cyenviron-control';
import { CyenvironStatus } from 'src/app/core/interfaces/cyenviron-status';
import { Device } from 'src/app/core/interfaces/device';
import { MqttMessage } from 'src/app/core/interfaces/mqtt-message';
import { HistoricalDataService } from 'src/app/core/services/historical-data.service';

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
  private _selectedPeriod: ChartPeriod;
  private _refreshInterval: any | null;
  device: Device | null;
  state: CyenvironStatus | null;
  commands: ControlCommand[];
  historicalMessages: MqttMessage[];
  histChartHumidity: ChartData | null;
  histChartTemp: ChartData | null;
  histChartPressure: ChartData | null;
  histChartBrightness: ChartData | null;
  lineChartOptions = {
    stacked: false,
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  constructor(
    private _location: Location,
    private _mqtt: MqttService,
    private _historicalData: HistoricalDataService
  ) {
    this._cyEnvironSub = null;
    this._selectedPeriod = ChartPeriod.HOUR;
    this.device = null;
    this.state = null;
    this.historicalMessages = [];
    this._refreshInterval = null;
    this.histChartHumidity = null;
    this.histChartTemp = null;
    this.histChartPressure = null;
    this.histChartBrightness = null;
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

  generateHistoricalChartData(): void {
    let selectedMessages: MqttMessage[] = [];

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

    this.historicalMessages.forEach((m) => {
      m.timestamp = new Date(Date.parse(`${m.timestamp}`));
    });

    selectedMessages = this.historicalMessages.filter(s => s.timestamp >= val && s.timestamp < now);

    const msgData = selectedMessages.map(m => JSON.parse(m.content) as CyenvironStatus);
    const chartLabels = msgData.map(m => {
      const timestamp = new Date(Date.parse(m.lastUpdate));
      let label = `${timestamp.toLocaleTimeString()}`;
      if (this._selectedPeriod == ChartPeriod.WEEK) {
        label = `${timestamp.toLocaleDateString()}`;
      }
      return label;
    });

    const humidityData: ChartDataset = {
      label: 'Humdity',
      borderColor: COLORSDARK[0],
      data: msgData.map(h => h.humidity),
      fill: false,
      tension: 0.1,
      pointStyle: 'rectRot',
      radius: 7
    };

    this.histChartHumidity = {
      labels: chartLabels,
      datasets: [humidityData]
    };

    const tempData: ChartDataset = {
      label: 'Temperature',
      borderColor: COLORSDARK[1],
      data: msgData.map(t => t.tempF),
      fill: false,
      tension: 0.1,
      pointStyle: 'rectRot',
      radius: 7
    };

    this.histChartTemp = {
      labels: chartLabels,
      datasets: [tempData]
    };

    const pressureData: ChartDataset = {
      label: 'Barometric Pressure',
      borderColor: COLORSDARK[2],
      data: msgData.map(p => p.pressureHpa),
      fill: false,
      tension: 0.1,
      pointStyle: 'rectRot',
      radius: 7
    };

    this.histChartPressure = {
      labels: chartLabels,
      datasets: [pressureData]
    };

    const brightnessData: ChartDataset = {
      label: 'Brightness',
      borderColor: COLORSDARK[3],
      data: msgData.map(b => b.brightness),
      fill: false,
      tension: 0.1,
      pointStyle: 'rectRot',
      radius: 7
    };

    this.histChartBrightness = {
      labels: chartLabels,
      datasets: [brightnessData]
    };
  }

  getHistoricalData(): void {
    this._historicalData.getHistoricalMessages(this.device!.statusTopicId, 7).subscribe({
      next: value => {
        this.historicalMessages = value;
        this.generateHistoricalChartData();
      }
    });
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

        this.getHistoricalData();
        this._refreshInterval ??= setInterval(() => {
          this.getHistoricalData();
        }, 10000);
      }
    }
  }

  ngOnDestroy(): void {
    if (this._cyEnvironSub) {
      this._cyEnvironSub.unsubscribe();
      this._cyEnvironSub = null;
    }

    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
      this._refreshInterval = null;
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

  onChartPeriodSelect(event: MatButtonToggleChange): void {
    this._selectedPeriod = event.value as ChartPeriod;
  }
}
