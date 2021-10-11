import { ConfigService } from "@nestjs/config";
import { mock } from "jest-mock-extended";
import { SecretsManagerService } from "../../../providers/secrets/secretsManager.service";
import { JwtStrategy } from "../../../auth/jwt/jwt.strategy";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../../../user/user.service";

describe("Testing the JWT strategy class", () => {
  const secretsService = mock<SecretsManagerService>();
  const userService = mock<UserService>();
  const jwtStrategy = new JwtStrategy(userService, secretsService);
});
