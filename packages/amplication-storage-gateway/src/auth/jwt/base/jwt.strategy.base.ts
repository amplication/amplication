import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class JwtStrategyBase extends PassportStrategy(Strategy) {
  constructor(protected readonly secretOrKey: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }
  async validate(payload: any): Promise<any> {
    const { username } = payload;
    // const user = await this.userService.findOne({
    //   where: { username },
    // });
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
    return true;
  }
}
