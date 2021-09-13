import { Pipe, PipeTransform } from '@angular/core';
import { Device } from '../interfaces/device';

@Pipe({
  name: 'activeDevices'
})
export class ActiveDevicesPipe implements PipeTransform {

  transform(value: any): Device[] {
    if (!value) {
      return [];
    }

    let devices = value as Device[];
    return devices ? devices.filter(d => d.isActive) : [];
  }
}
