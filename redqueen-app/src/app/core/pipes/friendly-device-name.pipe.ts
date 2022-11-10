import { Pipe, PipeTransform } from '@angular/core';
import { Device } from '../interfaces/device';

@Pipe({
  name: 'friendlyDeviceName'
})
export class FriendlyDeviceNamePipe implements PipeTransform {
  private isEmpty(val?: string): boolean {
    return val === null || val === undefined || val === "";
  }

  transform(value?: Device): string {
    if (!value) {
      return "";
    }

    return this.isEmpty(value.friendlyName) ? value.name : value.friendlyName!;
  }
}
