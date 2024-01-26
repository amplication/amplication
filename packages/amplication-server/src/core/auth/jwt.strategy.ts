import { JwtDto, EnumTokenType } from "./dto/jwt.dto";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthUser } from "./types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(req, payload: JwtDto): Promise<AuthUser> {
    if (payload.type === EnumTokenType.ApiToken) {
      const jwt = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

      const isValid = await this.authService.validateApiToken({
        userId: payload.userId,
        tokenId: payload.tokenId,
        token: jwt,
      });
      if (!isValid === true) {
        throw new UnauthorizedException();
      }
    }

    const user = await this.authService.getAuthUser({
      id: payload.userId,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
