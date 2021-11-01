/* eslint-disable import/no-unresolved */
//@ts-ignore
import { TokenServiceBase } from "../../auth/base/token.service.base";
import {
  INVALID_USERNAME_ERROR,
  INVALID_PASSWORD_ERROR,
  //@ts-ignore
} from "../../auth/constants";

describe("Testing the TokenServiceBase", () => {
  let tokenServiceBase: TokenServiceBase;
  beforeEach(() => {
    tokenServiceBase = new TokenServiceBase();
  });
  describe("Testing the BasicTokenService.createToken()", () => {
    it("should create valid token for given username and password", async () => {
      expect(await tokenServiceBase.createToken("admin", "admin")).toBe(
        "YWRtaW46YWRtaW4="
      );
    });
    it("should reject when username missing", () => {
      //@ts-ignore
      const result = tokenServiceBase.createToken(null, "admin");
      return expect(result).rejects.toBe(INVALID_USERNAME_ERROR);
    });
    it("should reject when password missing", () => {
      //@ts-ignore
      const result = tokenServiceBase.createToken("admin", null);
      return expect(result).rejects.toBe(INVALID_PASSWORD_ERROR);
    });
  });
});
