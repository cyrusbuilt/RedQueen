export interface MqttMessage {
  id: number;
  content: string;
  timestamp: Date;
  clientId: string;
  topicName: string;
}
