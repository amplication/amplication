import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserInfo } from "../UserInfo";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../../user/user.service";
import { SecretsManagerService } from "../../providers/secrets/secretsManager.service";
import { JWT_SECRET_KEY } from "../../constants";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    secretsService: SecretsManagerService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretsService.getSecret<string>(JWT_SECRET_KEY),
    });
  }

  async validate(payload: UserInfo): Promise<UserInfo> {
    const { username } = payload;
    const user = await this.userService.findOne({
      where: { username },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
