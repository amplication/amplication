import { Inject, Injectable } from "@nestjs/common";
import { JWT_SECRET_KEY_PROVIDER_NAME } from "../../constants";
import { JwtStrategyBase } from "./base/jwt.strategy.base";
import { UserService } from "../../user/user.service";

@Injectable()
export class JwtStrategy extends JwtStrategyBase {
  constructor(
    @Inject(JWT_SECRET_KEY_PROVIDER_NAME) secretOrKey: string,
    protected readonly userService: UserService
  ) {
    super(secretOrKey, userService);
  }
}
