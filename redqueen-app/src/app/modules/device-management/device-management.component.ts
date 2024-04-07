import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from 'src/app/core/interfaces/device';
import { DeviceService } from 'src/app/core/services/device.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-device-management',
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.scss']
})
export class DeviceManagementComponent implements OnInit {
  devices: Device[];
  curPage: number;
  pageSize: number;
  totalEntries: number;

  constructor(
    private _router: Router,
    private _deviceService: DeviceService,
    private _toastService: ToastService
  ) {
    this.devices = [];
    this.curPage = 1;
    this.pageSize = 10;
    this.totalEntries = 0;
  }

  refreshDevices(): void {
    this._deviceService.getDevicesPaginated(this.pageSize, this.curPage).subscribe({
      next: devs => {
        this.totalEntries = devs.recordCount;
        this.devices = devs.items;
        this.curPage = devs.pageNumber;
        this.pageSize = devs.pageSize;
      }
    });
  }

  ngOnInit(): void {
    this.refreshDevices();
  }

  activateOrDeactivateDevice(device: Device): void {
    device.isActive = !device.isActive;
    this._deviceService.updateDevice(device.id, device).subscribe({
      next: value => {
        if (value) {
          this.refreshDevices();
        }
        else {
          this._toastService.setErrorMessage("Failed to update device!");
        }
      }
    });
  }

  onAddDevice(): void {
    this._router.navigate(['/device-management/add']);
  }

  onEditDevice(dev: Device): void {
    sessionStorage.setItem('manageDevice', JSON.stringify(dev));
    this._router.navigate(['/device-management/edit']);
  }

  handlePageChange(event: number): void {
    this.curPage = event;
    this.refreshDevices();
  }
}
