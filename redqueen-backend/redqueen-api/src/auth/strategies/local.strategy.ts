import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '@redqueen-backend/redqueen-data/src/user/entity/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  public async validate(
    email: string,
    hashedPassword: string,
  ): Promise<User | null> {
    const user = await this.authService.validateUser(email, hashedPassword);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
