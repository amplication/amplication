import {
  capitalizeFirstLetter,
  formatModelName,
  formatFieldName,
} from "./schema-utils"; // replace 'filename' with the actual filename
import { isReservedName } from "../entity/reservedNames";

jest.mock("../entity/reservedNames", () => ({
  isReservedName: jest.fn(),
}));

describe("schema-utils", () => {
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

    it("should add 'Model' suffix if the model name is a reserved name", () => {
      (isReservedName as jest.Mock).mockReturnValueOnce(true);
      const result = formatModelName("test_model");
      expect(result).toEqual("TestModelModel");
    });
  });

  describe("formatFieldName", () => {
    it("should format the field name in camelCase", () => {
      (isReservedName as jest.Mock).mockReturnValueOnce(false);
      const result = formatFieldName("test_field");
      expect(result).toEqual("testField");
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
});
