import { Pipe, PipeTransform } from '@angular/core';
import { MqttTopic } from '../interfaces/mqtt-topic';

@Pipe({
  name: 'activeTopics'
})
export class ActiveTopicsPipe implements PipeTransform {

  transform(value: any): MqttTopic[] {
    if (!value) {
      return [];
    }

    let topics = (value as MqttTopic[]);
    return topics ? topics.filter(t => t.isActive) : [];
  }
}
