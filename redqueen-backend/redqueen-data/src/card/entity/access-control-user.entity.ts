import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from './card.entity';

@Entity({ name: 'access_control_user' })
export class AccessControlUser {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The record ID of the access control user',
    example: 22,
    type: 'integer',
  })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'The name of the AC user',
    example: 'foo',
    type: 'string',
    maxLength: 255,
  })
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  @ApiProperty({
    description: 'The pin number associated with this user',
    type: 'string',
    example: '123456',
    maxLength: 6,
  })
  @Column({ name: 'pin', type: 'varchar', length: 6 })
  pin: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Flag to indicate whether or not this AC user is active',
    example: true,
    default: true,
    type: 'boolean',
  })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Date of when the AC user was created',
    example: new Date().toDateString(),
    type: 'date',
    default: '[current date]',
  })
  @Column({
    name: 'created_date',
    type: 'date',
    default: new Date().toDateString(),
  })
  createdDate: Date;

  @IsDate()
  @ApiProperty({
    description: 'Date of when the AC user was last modified',
    example: new Date().toDateString(),
    type: 'date',
    nullable: true,
    required: false,
  })
  @Column({ name: 'modified_date', type: 'date', nullable: true })
  modifiedDate?: Date;

  cards: Card[] = [];
}
