import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { AccessControlUser } from '../entity/access-control-user.entity';
import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedAccessControlUsers extends PaginationDto {
  @IsArray()
  @ApiProperty({
    description: 'An array of access control users',
    type: [AccessControlUser],
  })
  items: AccessControlUser[];
}
