import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_SECRET_KEY } from "../../../constants";
import { SecretsManagerService } from "../../../providers/secrets/secretsManager.service";
import { IAuthStrategy } from "../../IAuthStrategy";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../../user/user.service";
import { UserInfo } from "../../UserInfo";

export class JwtStrategyBase
  extends PassportStrategy(Strategy)
  implements IAuthStrategy {
  constructor(
    protected readonly userService: UserService,
    protected readonly secretsService: SecretsManagerService
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
