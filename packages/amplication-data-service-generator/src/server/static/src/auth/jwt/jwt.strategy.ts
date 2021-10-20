import { Inject, Injectable } from "@nestjs/common";
import { JWT_SECRET_KEY } from "../../constants";
import { SecretsManagerService } from "../../providers/secrets/secretsManager.service";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../../user/user.service";
import { JwtStrategyBase } from "./base/jwt.stategy.base";
@Injectable()
export class JwtStrategy extends JwtStrategyBase {
  constructor(
    protected readonly userService: UserService,
    protected readonly secretsService: SecretsManagerService,
    @Inject(JWT_SECRET_KEY) secretOrKey: string
  ) {
    super(userService, secretsService, secretOrKey);
  }
}
