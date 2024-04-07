import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetRequestDto {
  @ApiProperty({
    description: 'The user ID',
    example: 'ade1a7d3-b77d-4647-a5d5-9324d4150546',
  })
  userId: string;

  @ApiProperty({
    description: 'The bearer access token for authentication',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImphbmUuZG9lQHNvbWUuZG9tYWluIiwic3ViIjoiYWRlMWE3ZDMtYjc3ZC00NjQ3LWE1ZDUtOTMyNGQ0MTUwNTQ2IiwiaWF0IjoxNzA2NzMwOTQ1LCJleHAiOjE3MDY3MzQ1NDV9.FzGZVQhacc2z6m1syeFYYGztYvKa14VQbMACL144ADM',
  })
  token: string;

  @ApiProperty({
    description: 'The new password to set',
    example: 'Password4321&',
  })
  newPassword: string;
}
