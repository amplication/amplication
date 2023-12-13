import {
  isAuthenticated,
  setTokenFromCookie,
  TOKEN_KEY,
  unsetToken,
} from "./authentication";
const TEMPORARY_JWT_COOKIE_NAME = "AJWT";

describe("authentication", () => {
  let spyOnWindowDocumentCookieGet: jest.SpyInstance;
  let spyOnWindowDocumentCookieSet: jest.SpyInstance;
  let spyOnlocalStorageGet: jest.SpyInstance;
  let spyOnlocalStorageSet: jest.SpyInstance;
  let spyOnlocalStorageRemove: jest.SpyInstance;

  beforeEach(() => {
    spyOnWindowDocumentCookieGet = jest.spyOn(window.document, "cookie", "get");
    spyOnWindowDocumentCookieSet = jest.spyOn(window.document, "cookie", "set");
    spyOnlocalStorageGet = jest.spyOn(Storage.prototype, "getItem");
    spyOnlocalStorageSet = jest.spyOn(Storage.prototype, "setItem");
    spyOnlocalStorageRemove = jest.spyOn(Storage.prototype, "removeItem");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("isAuthenticated", () => {
    it(`returns true when token is in local storage`, async () => {
      spyOnlocalStorageGet.mockReturnValueOnce("super-secret");

      const result = isAuthenticated();

      expect(result).toEqual(true);
    });

    it(`returns false when token is not in local storage`, async () => {
      unsetToken();
      const result = isAuthenticated();

      expect(result).toEqual(false);
    });
  });

  describe("setTokenFromCookie", () => {
    it(`stores the token in the local storage and delete the temporary cookie`, async () => {
      const expectedToken = "secret";
      spyOnWindowDocumentCookieGet.mockReturnValueOnce(
        `${TEMPORARY_JWT_COOKIE_NAME}=${expectedToken}`
      );

      setTokenFromCookie();

      expect(spyOnlocalStorageSet).toHaveBeenCalledWith(
        TOKEN_KEY,
        expectedToken
      );
      expect(spyOnWindowDocumentCookieSet).toHaveBeenCalled();
    });

    it(`doesn't delete the token from the local storage when not temporary cookies are passed`, async () => {
      spyOnWindowDocumentCookieGet.mockReturnValueOnce("otherCookie=123");

      setTokenFromCookie();

      expect(spyOnlocalStorageRemove).toHaveBeenCalledTimes(0);
      expect(spyOnWindowDocumentCookieSet).toHaveBeenCalledTimes(0);
    });
  });

  it(`unsetToken delete the token from the local storage`, async () => {
    unsetToken();
    expect(spyOnlocalStorageRemove).toHaveBeenCalledWith(TOKEN_KEY);
  });
});
