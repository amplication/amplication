import { isValidJSON, JsonFormatting } from "./util-json";

describe("isValidJSON", () => {
  it("should return true if string contains a valid json", () => {
    expect(isValidJSON('{"value":1}')).toBeTruthy();
  });
  it("should return false if string contains an invalid json", () => {
    expect(isValidJSON("value:as")).toBeFalsy();
  });
});

describe("JsonFormatting", () => {
  it("should return formatted Json", () => {
    expect(JsonFormatting({ value: 1 })).toEqual(
      JSON.stringify({ value: 1 }, null, 2)
    );
  });
  it("should return formatted Json", () => {
    expect(JsonFormatting('{ "value": 1 }')).toEqual(
      JSON.stringify(JSON.parse('{ "value": 1 }'), null, 2)
    );
  });
  it("should return same as input if not valid Json", () => {
    expect(JsonFormatting("value:as")).toEqual("value:as");
  });
});
