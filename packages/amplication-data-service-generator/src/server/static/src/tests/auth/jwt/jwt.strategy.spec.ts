import { mock } from "jest-mock-extended";
import { JwtStrategy } from "../../../auth/jwt/jwt.strategy";
import { SecretsManagerService } from "../../../providers/secrets/secretsManager.service";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../../../user/user.service";

describe("Testing the JWT strategy class", () => {
  const secretsService = mock<SecretsManagerService>();
  const userService = mock<UserService>();
  const jwtStrategy = new JwtStrategy(userService, secretsService);
});
