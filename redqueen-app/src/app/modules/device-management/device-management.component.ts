import { Component, OnInit } from '@angular/core';
import { Device } from 'src/app/core/interfaces/device';
import { DeviceService } from 'src/app/core/services/device.service';

@Component({
  selector: 'app-device-management',
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.scss']
})
export class DeviceManagementComponent implements OnInit {
  devices: Device[];

  constructor(private _deviceService: DeviceService) {
    this.devices = [];
  }

  ngOnInit(): void {
    this._deviceService.getDevices().subscribe({
      next: devs => this.devices = devs
    });
  }

  activateOrDeactivateDevice(device: Device): void {

  }
}
