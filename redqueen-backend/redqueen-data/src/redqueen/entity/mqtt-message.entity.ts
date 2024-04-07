import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsInstance,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MqttTopic } from './mqtt-topic.entity';

@Entity({ name: 'mqtt_message' })
export class MqttMessage {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The record ID of the message',
    example: 1,
    type: 'integer',
  })
  @PrimaryGeneratedColumn({ name: 'msg_id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  @ApiProperty({
    description: 'The message content',
    example: 'This is a message',
    type: 'string',
    maxLength: 1024,
  })
  @Column({ name: 'msg_content', type: 'varchar', length: 1024 })
  content: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Timestamp of when the message was received',
    example: new Date().toUTCString(),
    type: 'timestamp',
    default: '[current timestamp]',
  })
  @Column({ name: 'timestamp', type: 'timestamp', default: new Date() })
  timestamp: Date;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the topic this message relates to',
    example: 22,
    type: 'integer',
  })
  @Column({ name: 'topic_id', type: 'integer' })
  topicId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'The name/ID of the client',
    example: 'REDQUEEN',
    type: 'string',
    maxLength: 255,
  })
  @Column({ name: 'client_id', type: 'varchar', length: 255 })
  clientId: string;

  @IsInstance(MqttTopic)
  @ApiProperty({
    description: 'The topic this message was received on',
    type: MqttTopic,
  })
  @OneToOne(() => MqttTopic)
  @JoinColumn({ name: 'topic_id', referencedColumnName: 'id' })
  topic: MqttTopic;
}
