import { BasicTokenService } from "../../../auth/basic/basicToken.service";
import {
  INVALID_PASSWORD_ERROR,
  INVALID_USERNAME_ERROR,
} from "../../../auth/constants";

describe("Testing the BasicTokenService", () => {
  let basicTokenService: BasicTokenService;
  beforeEach(() => {
    basicTokenService = new BasicTokenService();
  });
  describe("Testing the BasicTokenService.createToken()", () => {
    it("should create valid token for given username and password", async () => {
      expect(await basicTokenService.createToken("admin", "admin")).toBe(
        "YWRtaW46YWRtaW4="
      );
    });
    it("should reject when username missing", () => {
      //@ts-ignore
      const result = basicTokenService.createToken(null, "admin");
      return expect(result).rejects.toBe(INVALID_USERNAME_ERROR);
    });
    it("should reject when password missing", () => {
      //@ts-ignore
      const result = basicTokenService.createToken("admin", null);
      return expect(result).rejects.toBe(INVALID_PASSWORD_ERROR);
    });
  });
});
