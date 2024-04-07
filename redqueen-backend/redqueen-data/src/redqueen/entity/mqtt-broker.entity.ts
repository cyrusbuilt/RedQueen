import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MqttTopic } from './mqtt-topic.entity';

@Entity({ name: 'mqtt_broker' })
export class MqttBroker {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The record ID of the broker',
    example: 5,
    type: 'integer',
  })
  @PrimaryGeneratedColumn({ name: 'broker_id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(253)
  @ApiProperty({
    description: 'The hostname or IP of the MQTT broker',
    example: 'mybroker_hostname',
    type: 'string',
    maxLength: 253,
  })
  @Column({ name: 'broker_host', type: 'varchar', length: 253 })
  host: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The port number of the broker host to connect to',
    example: 8888,
    type: 'integer',
  })
  @Column({ name: 'broker_port', type: 'integer' })
  port: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'The username to authenticate the broker connection with',
    example: 'someuser',
    type: 'string',
    maxLength: 255,
  })
  @Column({ name: 'username', type: 'varchar', length: 255 })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'The password to authenticate the broker connection with',
    example: 'some_password',
    type: 'string',
    maxLength: 255,
  })
  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Flag to indicate whether or not the broker is active',
    example: true,
    type: 'boolean',
    default: true,
  })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Timestamp from when the broker was created',
    example: new Date().toUTCString(),
    type: 'timestamp',
    default: '[current timestamp]',
  })
  @Column({
    name: 'created_date',
    type: 'timestamp',
    default: new Date(),
  })
  createdDate: Date;

  @IsDate()
  @ApiProperty({
    description: 'Timestamp from when the broker was last modified',
    example: new Date().toUTCString(),
    type: 'timestamp',
    nullable: true,
    required: false,
  })
  @Column({ name: 'modified_date', type: 'timestamp', nullable: true })
  modifiedDate?: Date;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Indicates whether or not to use TLS when connecting to the broker',
    example: false,
    default: false,
    type: 'boolean',
  })
  @Column({ name: 'use_tls', type: 'boolean', default: false })
  useTLS: boolean;

  @IsInt()
  @ApiProperty({
    description: 'The connection keep-alive in seconds',
    example: 10,
    type: 'integer',
    nullable: true,
    required: false,
  })
  @Column({ name: 'keep_alive_seconds', type: 'integer', nullable: true })
  keepAliveSeconds?: number;

  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'The name of the topic to use for device discovery',
    example: 'redqueen/discovery',
    type: 'string',
    nullable: true,
    required: false,
  })
  @Column({
    name: 'discovery_topic',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  discoveryTopic?: string;

  @IsInt()
  @ApiProperty({
    description:
      'The websocket port to connect to the broker on (if applicable)',
    example: 9001,
    type: 'integer',
    nullable: true,
    required: false,
  })
  @Column({ name: 'ws_port', type: 'integer', nullable: true })
  webSocketsPort?: number;

  @IsArray()
  @ApiProperty({
    description: 'The list of topics associated with this broker',
    required: false,
    type: [MqttTopic],
  })
  topics: MqttTopic[] = [];
}
