import { ApiProperty } from '@nestjs/swagger';

export class GeneralResponseDto {
  @ApiProperty({
    description: 'Result status of the API call',
    example: 'Success',
    type: 'string',
  })
  status: string;

  @ApiProperty({
    description: 'Result status of the API call',
    example: 'Success',
    type: 'string',
  })
  message: string;

  constructor(status: string, message: string) {
    this.status = status;
    this.message = message;
  }
}
