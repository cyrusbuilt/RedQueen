import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class MqttTopicDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'The name of the topic',
    example: 'somedevice/status',
    type: 'string',
    maxLength: 255,
  })
  name: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the broker this topic belongs to',
    example: 5,
    type: 'integer',
  })
  brokerId: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Flag to indicate whether or no this topic is active',
    example: true,
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}
