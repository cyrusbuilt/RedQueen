import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class DeviceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(253)
  @ApiProperty({
    description: 'The name of the device',
    example: 'cygarage',
    type: 'string',
    maxLength: 253,
  })
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
  friendlyName: string;

  @IsInt()
  @ApiProperty({
    description: 'The ID of the topic used for control messages',
    example: 4,
    type: 'integer',
    nullable: true,
    required: false,
  })
  controlTopicId?: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the topic used for status messages',
    example: 1,
    type: 'integer',
  })
  statusTopicId: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Flag that indicates whether or not the device is active',
    example: true,
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'The name of the device class this device belongs to',
    example: 'opener',
    type: 'string',
    maxLength: 255,
  })
  class: string;
}
