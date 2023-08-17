import { isReservedName } from "../entity/reservedNames";
import {
  capitalizeFirstLetter,
  formatModelName,
  formatFieldName,
  formatDisplayName,
} from "./helpers";

jest.mock("../entity/reservedNames", () => ({
  isReservedName: jest.fn(),
}));

describe("helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("capitalizeFirstLetter", () => {
    it("should capitalize the first letter of the string", () => {
      const result = capitalizeFirstLetter("test");
      expect(result).toEqual("Test");
    });
  });

  describe("formatModelName", () => {
    it("should format the model name in PascalCase", () => {
      (isReservedName as jest.Mock).mockReturnValueOnce(false);
      const result = formatModelName("test_models");
      expect(result).toEqual("TestModel");
    });

    it("should format the model name with acronyms in PascalCase", () => {
      (isReservedName as jest.Mock).mockReturnValueOnce(false);
      const result = formatModelName("myDBName");
      expect(result).toEqual("MyDbName");
    });

    it("should add 'Model' suffix if the model name is a reserved name", () => {
      (isReservedName as jest.Mock).mockReturnValueOnce(true);
      const result = formatModelName("test_model");
      expect(result).toEqual("TestModelModel");
    });
  });

  describe("formatFieldName", () => {
    it("should throw an error if fieldName is and empty string", () => {
      expect(() => formatFieldName(" ")).toThrow("Field name cannot be empty");
    });

    it("should throw an error if fieldName is not provided", () => {
      expect(() => formatFieldName(null)).toThrow("Field name is required");
    });

    it("should format the field name in camelCase when the field name includes uppercase letters, numbers and underscore", () => {
      (isReservedName as jest.Mock).mockReturnValueOnce(false);
      const result = formatFieldName("Test_5_Rank_X_out_of_Y");
      expect(result).toEqual("test5RankXOutOfY");
    });

    it("should format the field name in camelCase when the field name includes underscore", () => {
      expect(formatFieldName("Another_test_string")).toEqual(
        "anotherTestString"
      );
    });

    it("should not do anything if the field is already in camelCase", () => {
      expect(formatFieldName("testCase")).toEqual("testCase");
    });

    it("should format the field name in camelCase when the field name is all uppercase and includes underscore", () => {
      expect(formatFieldName("TEST_CASE")).toEqual("testCase");
    });

    it("should add 'Field' suffix if the field name is a reserved name", () => {
      (isReservedName as jest.Mock).mockReturnValueOnce(true);
      const result = formatFieldName("test");
      expect(result).toEqual("testField");
    });

    it("should return the same function name if field name is a function", () => {
      (isReservedName as jest.Mock).mockReturnValueOnce(false);
      const result = formatFieldName({
        type: "function",
        name: "test_function",
        params: [],
      });
      expect(result).toEqual("test_function");
    });
  });

  describe("formatDisplayName", () => {
    it("should return a formatted display name", () => {
      const result = formatDisplayName("test_display_name");
      expect(result).toEqual("Test Display Name");
    });
  });
});
