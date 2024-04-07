import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { Device } from '../entity/device.entity';

export class PaginatedDevices extends PaginationDto {
  @IsArray()
  @ApiProperty({
    description: 'An array of Devices',
    type: [Device],
  })
  items: Device[];
}
