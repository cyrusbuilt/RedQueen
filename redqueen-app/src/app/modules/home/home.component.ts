import { Component, OnInit } from '@angular/core';
import { Tile } from 'src/app/core/interfaces/tile';
import { IMqttServiceOptions, MqttService } from 'ngx-mqtt';
import { Device } from 'src/app/core/interfaces/device';
import { DeviceService } from 'src/app/core/services/device.service';
import { TelemetryService } from 'src/app/core/services/telemetry.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

interface DeviceTile extends Tile {
  device: Device;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  devices: Device[];
  deviceTiles: DeviceTile[];

  constructor(
    private _telemService: TelemetryService,
    private _mqtt: MqttService,
    private _deviceService: DeviceService,
    private _router: Router
  ) {
    this.devices = [];
    this.deviceTiles = [];
  }

  connectMqtt(): void {
    this._telemService.getBrokerById(environment.mqtt.brokerId).subscribe({
      next: broker => {
        if (broker && broker.webSocketsPort) {
          const opts = {
            hostname: broker.host,
            port: broker.webSocketsPort,
            //keepalive: broker.keepAliveSeconds,
            username: broker.username,
            password: broker.password,
            protocol: environment.mqtt.protocol
          } as IMqttServiceOptions;

          // TODO store opts so we can reconnect to mqtt somehow later?

          this._mqtt.connect(opts);

          this._mqtt.onConnect.asObservable().subscribe({
            next: value => console.log('Connected:', value)
          });
          this._mqtt.onError.asObservable().subscribe({
            next: value => console.log('Error:', value)
          });
          this._mqtt.onReconnect.asObservable().subscribe({
            next: value => console.log('Reconnect:', value)
          })
        }
      }
    });
  }

  getDevices(): void {
    this._deviceService.getDevices().subscribe({
      next: value => {
        this.devices = value.filter(d => d.isActive);
        for (let d of this.devices) {
          let tile: DeviceTile = {
            text: d.name,
            cols: 1,
            rows: 2,
            color: 'white',
            device: d
          };

          this.deviceTiles.push(tile);
        }
      }
    });
  }

  ngOnInit(): void {
    this.connectMqtt();
    this.getDevices();
  }

  onDeviceManageClick(device: Device): void {
    sessionStorage.setItem('integrationDevice', JSON.stringify(device));

    if (device.class === "cylights") {
      this._router.navigate(['/integrations/cylights']);
    }
    else if (device.class === "cygarage") {
      this._router.navigate(['/integrations/cygarage']);
    }
    else if (device.class === "clcontroller") {
      this._router.navigate(['/integrations/clcontroller']);
    }
    else if (device.class === "espstat") {
      this._router.navigate(['/integrations/espstat']);
    }
    else if (device.class === "cysump") {
      this._router.navigate(['/integrations/cysump']);
    }
  }
}
