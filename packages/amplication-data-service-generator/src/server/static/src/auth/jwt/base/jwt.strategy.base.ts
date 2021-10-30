import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
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
    protected readonly secretOrKey: string
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
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
