import { UnauthorizedException } from "@nestjs/common";
import { mock } from "jest-mock-extended";
import { AuthService } from "../../../auth/auth.service";
import { BasicStrategyBase } from "../../../auth/basic/base/basic.strategy.base";
import { TEST_USER } from "../constants";

describe("Testing the basicStrategyBase.validate()", () => {
  const TEST_PASSWORD = "gabay";
  const authService = mock<AuthService>();
  const basicStrategy = new BasicStrategyBase(authService);
  beforeEach(() => {
    authService.validateUser.mockClear();
  });
  beforeAll(() => {
    //ARRANGE
    authService.validateUser
      .calledWith(TEST_USER.username, TEST_PASSWORD)
      .mockReturnValue(Promise.resolve(TEST_USER));
  });
  it("should return the user", async () => {
    //ACT
    const result = await basicStrategy.validate(
      TEST_USER.username,
      TEST_PASSWORD
    );
    //ASSERT
    expect(result).toBe(TEST_USER);
  });
  it("should throw error if there is not valid user", async () => {
    //ARRANGE
    authService.validateUser.mockReturnValue(Promise.resolve(null));
    //ACT
    const result = basicStrategy.validate("noUsername", TEST_PASSWORD);
    //ASSERT
    return expect(result).rejects.toThrowError(UnauthorizedException);
  });
});
