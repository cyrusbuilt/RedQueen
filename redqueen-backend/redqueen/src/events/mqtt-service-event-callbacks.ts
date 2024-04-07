import { IPublishPacket } from 'mqtt/*';

export interface MqttMessageReceivedArgs {
  host: string;
  topic: string;
  payload: Buffer;
  packet: IPublishPacket;
}

export type OnMessageReceivedEvent = (
  sender: any,
  eventArgs: MqttMessageReceivedArgs,
) => void;

export interface MqttServiceEventCallbacks {
  messageReceived: OnMessageReceivedEvent;
}
