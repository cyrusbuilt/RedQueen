import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { LoginHistoryDto } from './login_history.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedLoginHistoryDto extends PaginationDto {
  @ApiProperty({
    description: 'An array of login history records',
    type: [LoginHistoryDto],
  })
  items: LoginHistoryDto[];
}
