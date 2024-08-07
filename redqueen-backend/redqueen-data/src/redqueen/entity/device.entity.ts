import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
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

@Entity({ name: 'device' })
export class Device {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The record ID of the device',
    example: 2,
    type: 'integer',
  })
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id: number;

  @IsString()
  @MaxLength(253)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the device',
    example: 'cygarage',
    type: 'string',
    maxLength: 253,
  })
  @Column({ name: 'name', type: 'varchar', length: 253 })
  name: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The friendly name of the device',
    example: 'Garage controller',
    type: 'string',
    maxLength: 255,
  })
  @Column({ name: 'friendly_name', type: 'varchar', length: 255 })
  friendlyName: string;

  @IsInt()
  @ApiProperty({
    description: 'The ID of the topic used for control messages',
    example: 4,
    type: 'integer',
    nullable: true,
    required: false,
  })
  @Column({ name: 'control_topic_id', type: 'integer', nullable: true })
  controlTopicId?: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the topic used for status messages',
    example: 1,
    type: 'integer',
  })
  @Column({ name: 'status_topic_id', type: 'integer' })
  statusTopicId: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Flag that indicates whether or not the device is active',
    example: true,
    type: 'boolean',
    default: true,
  })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Timestamp of when the device was created',
    example: new Date().toUTCString(),
    type: 'timestamp',
    default: '[current timestamp]',
  })
  @Column({ name: 'created_date', type: 'timestamp', default: new Date() })
  createdDate: Date;

  @IsDate()
  @ApiProperty({
    description: 'Timestamp of when the device was last modified',
    example: new Date().toUTCString(),
    type: 'timestamp',
    nullable: true,
    required: false,
  })
  @Column({ name: 'modified_date', type: 'timestamp', nullable: true })
  modifiedDate?: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'The name of the device class this device belongs to',
    example: 'opener',
    type: 'string',
    maxLength: 255,
  })
  @Column({ name: 'class', type: 'varchar', length: 255 })
  class: string;

  @IsInstance(MqttTopic)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The MQTT topic the device reports status to',
    type: MqttTopic,
  })
  @OneToOne(() => MqttTopic)
  @JoinColumn({ name: 'status_topic_id', referencedColumnName: 'id' })
  statusTopic: MqttTopic;

  @IsInstance(MqttTopic)
  @ApiProperty({
    description: 'The MQTT topic the device accepts control messages from',
    type: MqttTopic,
    required: false,
    nullable: true,
  })
  @OneToOne(() => MqttTopic)
  @JoinColumn({ name: 'control_topic_id', referencedColumnName: 'id' })
  controlTopic?: MqttTopic;
}
