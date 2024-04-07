import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class MqttBrokerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(253)
  @ApiProperty({
    description: 'The hostname or IP of the MQTT broker',
    example: 'mybroker_hostname',
    type: 'string',
    maxLength: 253,
  })
  host: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The port number of the broker host to connect to',
    example: 8888,
    type: 'integer',
  })
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
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Flag to indicate whether or not the broker is active',
    example: true,
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Indicates whether or not to use TLS when connecting to the broker',
    example: false,
    default: false,
    type: 'boolean',
  })
  useTLS: boolean;

  @IsInt()
  @ApiProperty({
    description: 'The connection keep-alive in seconds',
    example: 10,
    type: 'integer',
    nullable: true,
    required: false,
  })
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
  webSocketsPort?: number;
}
