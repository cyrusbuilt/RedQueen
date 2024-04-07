import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { Card } from '../entity/card.entity';
import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedCards extends PaginationDto {
  @IsArray()
  @ApiProperty({
    description: 'An array of access control cards',
    type: [Card],
  })
  items: Card[];
}
