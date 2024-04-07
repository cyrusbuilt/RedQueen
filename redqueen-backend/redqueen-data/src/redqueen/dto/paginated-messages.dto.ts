import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { MqttMessage } from '../entity/mqtt-message.entity';
import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMessages extends PaginationDto {
  @IsArray()
  @ApiProperty({
    description: 'An array of MQTT messages reported by devices',
    type: [MqttMessage],
  })
  items: MqttMessage[];
}
