import { mock } from "jest-mock-extended";
import { AuthService } from "../../../auth/auth.service";
import { BasicStrategy } from "../../../auth/basic/basic.strategy";
import { UserInfo } from "../../../auth/UserInfo";

describe("Testing the basic strategy", () => {
  const authService = mock<AuthService>();
  const basicStrategy = new BasicStrategy(authService);
  const user: UserInfo = { roles: ["User"], username: "ofek" };
  beforeEach(() => {
    authService.validateUser.mockClear();
  });
  it("should return the user", async () => {
    //ARRANGE
    authService.validateUser.mockReturnValue(Promise.resolve(user));
    //ACT
    expect(await basicStrategy.validate(user.username, "gabay")).toBe(user);
  });
  //TODO finish the test
  //   it("should throw error", async () => {
  //     //ARRANGE
  //     authService.validateUser.mockReturnValue(Promise.resolve(null));
  //     //ACT
  //     expect(await basicStrategy.validate("noUsername", "gabay")).toThrow();
  //   });
});
