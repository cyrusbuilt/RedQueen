import { ApiProperty } from '@nestjs/swagger';
import { LoginHistory } from '../entity/login_history.entity';

export class LoginHistoryDto extends LoginHistory {
  @ApiProperty({
    description: 'The email address associated with the user',
    example: 'john.doe@some.domain',
  })
  public email: string;
}
