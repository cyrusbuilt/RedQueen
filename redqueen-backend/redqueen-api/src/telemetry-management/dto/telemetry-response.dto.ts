import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TelemetryResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The RedQueen API version',
    example: '1.0.0',
    type: 'string',
  })
  apiVersion: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The name of the MQTT topic the daemon reports status messages to',
    example: 'redqueen/status',
    type: 'string',
  })
  daemonStatusTopic: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the MQTT topic the daemon receives controls from',
    example: 'redqueen/control',
    type: 'string',
  })
  daemonControlTopic: string;

  constructor(version: string, statusTopic: string, controlTopic: string) {
    this.apiVersion = version;
    this.daemonStatusTopic = statusTopic;
    this.daemonControlTopic = controlTopic;
  }
}
