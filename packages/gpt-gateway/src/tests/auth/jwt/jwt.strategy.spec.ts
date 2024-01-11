import { JwtStrategyBase } from "../../../auth/jwt/base/jwt.strategy.base";
import { UserService } from "../../../user/user.service";
import { TEST_USER } from "../constants";
import { UnauthorizedException } from "@nestjs/common";
import { mock } from "jest-mock-extended";
describe("Testing the jwtStrategyBase.validate()", () => {
  const userService = mock<UserService>();
  const jwtStrategy = new JwtStrategyBase("Secrete", userService);
  beforeEach(() => {
    userService.user.mockClear();
  });
  it("should throw UnauthorizedException where there is no user", async () => {
    //ARRANGE
    userService.user
      .calledWith({
        where: { username: TEST_USER.username },
      })
      .mockReturnValue(Promise.resolve(null));
    //ACT
    const result = jwtStrategy.validate({
      id: TEST_USER.id,
      username: TEST_USER.username,
      roles: TEST_USER.roles,
    });
    //ASSERT
    return expect(result).rejects.toThrowError(UnauthorizedException);
  });
});
