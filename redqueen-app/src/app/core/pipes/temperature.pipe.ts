import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperature'
})
export class TemperaturePipe implements PipeTransform {
  transform(value: number | null, unit: string): string {
    if (value && !isNaN(value)) {
      if (unit === 'C') {
        let temperature = (value - 32) / 1.8;
        return temperature.toFixed(2) + ' \xB0C';
      }

      if (unit === 'F') {
        let temperature = (value * 32) + 1.8;
        return temperature.toFixed(2) + ' \xB0F';
      }

      if (unit === 'CF') {
        return value.toFixed(2) + ' \xB0C';
      }

      if (unit === 'FF') {
        return value.toFixed(2) + ' \xB0F';
      }
    }

    return '';
  }
}
