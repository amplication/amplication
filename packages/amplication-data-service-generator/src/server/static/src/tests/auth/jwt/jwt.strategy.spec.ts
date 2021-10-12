import { UnauthorizedException } from "@nestjs/common";
import { mock } from "jest-mock-extended";
import { JwtStrategy } from "../../../auth/jwt/jwt.strategy";
import { SecretsManagerService } from "../../../providers/secrets/secretsManager.service";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../../../user/user.service";

describe("Testing the JWT strategy class", () => {
  const JWT_SECRET_KEY = "JWT_SECRET_KEY";
  const secretsService = mock<SecretsManagerService>();
  secretsService.getSecret.mockReturnValue(Promise.resolve(JWT_SECRET_KEY));
  const userService = mock<UserService>();
  const jwtStrategy = new JwtStrategy(userService, secretsService);
  beforeEach(() => {
    userService.findOne.mockClear();
  });
  test("When there is no user throw error", async () => {
    //ARRANGE
    userService.findOne.mockReturnValue(Promise.resolve(null));

    //ACT
    //TODO finish the test
    expect(
      await jwtStrategy.validate({
        username: "ofek",
        roles: ["User"],
      })
    ).toThrowError(UnauthorizedException);
  });
});
