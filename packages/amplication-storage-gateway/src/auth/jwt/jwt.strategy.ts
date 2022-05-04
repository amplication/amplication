import { Inject, Injectable } from "@nestjs/common";
import { JWT_SECRET_KEY } from "../../constants";
import { JwtStrategyBase } from "./base/jwt.strategy.base";

@Injectable()
export class JwtStrategy extends JwtStrategyBase {
  constructor(@Inject(JWT_SECRET_KEY) secretOrKey: string) {
    super(secretOrKey);
  }
}
