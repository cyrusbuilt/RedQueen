import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class LoginRequestDto {
  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide a valid email.' })
  @ApiProperty({
    description: "The user's email address",
    example: 'jane.doe@some.domain',
  })
  email: string;

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters,
    at least one uppercase letter,
    one lowercase letter,
    one number and
    one special character`,
  })
  @ApiProperty({
    description: "The user's password",
    example: 'Password1234!',
  })
  password: string;
}
