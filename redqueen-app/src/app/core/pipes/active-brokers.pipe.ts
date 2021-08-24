import { Pipe, PipeTransform } from '@angular/core';
import { MqttBroker } from '../interfaces/mqtt-broker';

@Pipe({
  name: 'activeBrokers'
})
export class ActiveBrokersPipe implements PipeTransform {
  transform(value: any): MqttBroker[] {
    if (!value) {
      return [];
    }

    const brokers = (value as MqttBroker[]);
    return brokers ? brokers.filter(b => b.isActive) : [];
  }
}
