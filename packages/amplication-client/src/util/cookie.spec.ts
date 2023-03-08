import { expireCookie, getCookie } from "./cookie";

describe("Cookies", () => {
  let spyOnWindowDocumentCookieGet: jest.SpyInstance;
  let spyOnWindowDocumentCookieSet: jest.SpyInstance;

  beforeEach(() => {
    spyOnWindowDocumentCookieGet = jest.spyOn(window.document, "cookie", "get");
    spyOnWindowDocumentCookieSet = jest.spyOn(window.document, "cookie", "set");
  });

  afterEach(() => {
    spyOnWindowDocumentCookieGet.mockRestore();
    spyOnWindowDocumentCookieSet.mockRestore();
  });

  it(`read a cookie value`, async () => {
    const expected = "my-value";
    spyOnWindowDocumentCookieGet.mockReturnValueOnce(`mycookie=${expected}`);

    const result = getCookie("mycookie");

    expect(result).toEqual(expected);
  });

  it(`set a cookie value`, async () => {
    expireCookie("mycookie");

    expect(spyOnWindowDocumentCookieSet).toHaveBeenCalledWith(
      "mycookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    );
  });
});
