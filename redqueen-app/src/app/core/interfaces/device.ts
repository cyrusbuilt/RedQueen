import { MqttTopic } from "./mqtt-topic";

export interface Device {
  id: number;
  name: string;
  isActive: boolean;
  statusTopicId: number;
  controlTopicId: number;
  statusTopic?: MqttTopic;
  controlTopic?: MqttTopic;
  createdDate: Date;
  modifiedDate?: Date;
  class: string;
}
