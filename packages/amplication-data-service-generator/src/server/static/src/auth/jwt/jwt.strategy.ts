import { Injectable } from "@nestjs/common";
import { SecretsManagerService } from "../../providers/secrets/secretsManager.service";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../../user/user.service";
import { JwtStrategyBase } from "./base/jwt.stategy.base";
@Injectable()
export class JwtStrategy extends JwtStrategyBase {
  constructor(
    protected readonly userService: UserService,
    protected readonly secretsService: SecretsManagerService
  ) {
    super(userService, secretsService);
  }
}
