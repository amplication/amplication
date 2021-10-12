import { UnauthorizedException } from "@nestjs/common";
import { mock } from "jest-mock-extended";
import { JwtStrategy } from "../../../auth/jwt/jwt.strategy";
import { SecretsManagerService } from "../../../providers/secrets/secretsManager.service";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../../../user/user.service";
import { TEST_USER } from "../constants";

describe("Testing the jwtStrategy.validate()", () => {
  const JWT_SECRET_KEY = "JWT_SECRET_KEY";
  const secretsService = mock<SecretsManagerService>();
  secretsService.getSecret.mockReturnValue(Promise.resolve(JWT_SECRET_KEY));
  const userService = mock<UserService>();
  const jwtStrategy = new JwtStrategy(userService, secretsService);
  beforeEach(() => {
    userService.findOne.mockClear();
  });
  it("should throw UnauthorizedException where there is no user", async () => {
    //ARRANGE
    userService.findOne.mockReturnValue(Promise.resolve(null));
    //ACT
    const result = jwtStrategy.validate({
      username: TEST_USER.username,
      roles: TEST_USER.roles,
    });
    //ASSERT
    return expect(result).rejects.toThrowError(UnauthorizedException);
  });
});
