import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const SECRET_VAR = 'SERVICE_JWT_SECRET';
export const NAME = 'background-jwt';

@Injectable()
export class BackgroundJwtStrategy extends PassportStrategy(Strategy, NAME) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(SECRET_VAR)
    });
  }

  validate(): boolean {
    return true;
  }
}
