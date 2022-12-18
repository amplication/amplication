import { TokenServiceBase } from "../../auth/base/token.service.base";
import {
  INVALID_USERNAME_ERROR,
  INVALID_PASSWORD_ERROR,
} from "../../auth/constants";
import { SIGN_TOKEN, VALID_CREDENTIALS, VALID_ID } from "./constants";

describe("Testing the TokenServiceBase", () => {
  let tokenServiceBase: TokenServiceBase;
  beforeEach(() => {
    tokenServiceBase = new TokenServiceBase();
  });
  describe("Testing the BasicTokenService.createToken()", () => {
    it("should create valid token for given username and password", async () => {
      expect(
        await tokenServiceBase.createToken({
          id: VALID_ID,
          username: "admin",
          password: "admin",
        })
      ).toBe("YWRtaW46YWRtaW4=");
    });
    it("should reject when username missing", () => {
      const result = tokenServiceBase.createToken({
        id: VALID_ID,
        //@ts-ignore
        username: null,
        password: VALID_CREDENTIALS.password,
      });
      return expect(result).rejects.toBe(INVALID_USERNAME_ERROR);
    });
    it("should reject when password missing", () => {
      const result = tokenServiceBase.createToken({
        id: VALID_ID,
        username: VALID_CREDENTIALS.username,
        //@ts-ignore
        password: null,
      });
      return expect(result).rejects.toBe(INVALID_PASSWORD_ERROR);
    });
  });
});
