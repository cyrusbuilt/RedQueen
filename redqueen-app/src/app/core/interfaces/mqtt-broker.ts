export interface MqttBroker {
  id: number;
  host: string;
  port: number;
  username: string;
  password: string;
  isActive: boolean;
  createdDate: Date;
  modifiedDate?: Date;
  useTls: boolean;
  keepAliveSeconds?: number;
}
