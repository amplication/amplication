import { isValidJSON } from "./util-json";

describe("isValidJSON", () => {
  it("should return true if string contains a valid json", () => {
    expect(isValidJSON('{"value":1}')).toBeTruthy();
  });
  it("should return false if string contains an invalid json", () => {
    expect(isValidJSON("value:as")).toBeFalsy();
  });
});
