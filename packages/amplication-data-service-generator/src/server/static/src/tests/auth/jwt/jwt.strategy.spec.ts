import { UnauthorizedException } from "@nestjs/common";
import { mock } from "jest-mock-extended";
import { JwtStrategyBase } from "../../../auth/jwt/base/jwt.strategy.base";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../../../user/user.service";
import { TEST_USER } from "../constants";

describe("Testing the jwtStrategyBase.validate()", () => {
  const userService = mock<UserService>();
  const jwtStrategy = new JwtStrategyBase(userService, "Secrete");
  beforeEach(() => {
    userService.findOne.mockClear();
  });
  it("should throw UnauthorizedException where there is no user", async () => {
    //ARRANGE
    userService.findOne
      .calledWith({ where: { username: TEST_USER.username } })
      .mockReturnValue(Promise.resolve(null));
    //ACT
    const result = jwtStrategy.validate({
      username: TEST_USER.username,
      roles: TEST_USER.roles,
    });
    //ASSERT
    return expect(result).rejects.toThrowError(UnauthorizedException);
  });
});
