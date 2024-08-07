import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ErrorResponseDto {
  @IsInt()
  @ApiProperty({
    description: 'The response status code',
    example: HttpStatus.OK,
    type: 'integer',
  })
  statusCode: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The status message',
    example: 'Success',
    type: 'string',
  })
  message: string;
}
