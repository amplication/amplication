import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_SECRET_KEY } from "../../constants";
import { JwtStrategyBase } from "./base/jwt.strategy.base";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(JWT_SECRET_KEY) secretOrKey: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }
}
