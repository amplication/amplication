import { JWT_SECRET_KEY } from "../../constants";
import { UserService } from "../../user/user.service";
import { JwtStrategyBase } from "./base/jwt.strategy.base";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends JwtStrategyBase {
  constructor(
    @Inject(JWT_SECRET_KEY) secretOrKey: string,
    protected readonly userService: UserService
  ) {
    super(secretOrKey, userService);
  }
}
