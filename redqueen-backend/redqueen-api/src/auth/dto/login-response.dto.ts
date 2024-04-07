import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description:
      'The access bearer JWT token if auth was succesful; Otherwise, null.',
    example: '123456',
    required: false,
  })
  token: string | null;

  @ApiProperty({
    description: 'The ID of the authenticated user.',
    example: 'ade1a7d3-b77d-4647-a5d5-9324d4150546',
    required: false,
  })
  userId: string | null;

  @ApiProperty({
    description: 'True if login was successful',
    example: 'true',
  })
  success: boolean;

  @ApiProperty({
    description: 'The timestamp of when the access token will expire.',
    example: '2024-01-31T13:08:52.221',
    required: false,
  })
  expiration: Date | null;
}
