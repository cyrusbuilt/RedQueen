import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import Configuration from 'src/configuration';
import { JwtSigningPayloadDto, JwtValidationDto } from '../dto/vaidation.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Configuration.shared.jwtSecret,
    });
  }

  public async validate(
    payload: JwtSigningPayloadDto,
  ): Promise<JwtValidationDto> {
    const result: JwtValidationDto = {
      userId: payload.sub,
      username: payload.username,
    };
    return result;
  }
}
