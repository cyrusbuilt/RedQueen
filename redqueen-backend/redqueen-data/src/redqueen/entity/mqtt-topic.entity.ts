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
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MqttBroker } from './mqtt-broker.entity';

@Entity({ name: 'mqtt_topic' })
export class MqttTopic {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The record ID of the topic',
    example: 5,
    type: 'integer',
  })
  @PrimaryGeneratedColumn({ name: 'topic_id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'The name of the topic',
    example: 'somedevice/status',
    type: 'string',
    maxLength: 255,
  })
  @Column({ name: 'topic_name', type: 'varchar', length: 255 })
  name: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the broker this topic belongs to',
    example: 5,
    type: 'integer',
  })
  @Column({ name: 'broker_id', type: 'integer' })
  brokerId: number;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The timestamp of when the topic was created',
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
    description: 'The timestamp of when the topic was last modified',
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
    description: 'Flag to indicate whether or no this topic is active',
    example: true,
    type: 'boolean',
    default: true,
  })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @IsInstance(MqttBroker)
  @ApiProperty({
    description: 'The broker this topic belongs to',
    type: MqttBroker,
  })
  @ManyToOne(() => MqttBroker, (broker) => broker.topics, { eager: true })
  @JoinColumn({ name: 'broker_id', referencedColumnName: 'id' })
  broker: MqttBroker;
}
