import { validate, ValidationError } from "class-validator";
import { IsJSONValue } from "./is-json-value-validator";

class TestClass {
  @IsJSONValue()
  jsonProperty: unknown;
}

describe("IsJSONValue", () => {
  it("should validate a valid JSON string", async () => {
    const testObj = new TestClass();
    testObj.jsonProperty = '{"name": "John", "age": 30}';
    const errors: ValidationError[] = await validate(testObj);
    expect(errors.length).toBe(0);
  });

  it("should not validate an invalid JSON string", async () => {
    const testObj = new TestClass();
    testObj.jsonProperty = '{name: "John", age: 30}';
    const errors: ValidationError[] = await validate(testObj);
    expect(errors.length).toBe(1);
  });

  it("should not validate an invalid JSON string", async () => {
    const testObj = new TestClass();
    testObj.jsonProperty = "John";
    const errors: ValidationError[] = await validate(testObj);
    expect(errors.length).toBe(1);
  });

  it("should validate a valid JSON object", async () => {
    const testObj = new TestClass();
    testObj.jsonProperty = { name: "John", age: 30 };
    const errors: ValidationError[] = await validate(testObj);
    expect(errors.length).toBe(0);
  });

  it("should validate a valid JSON array", async () => {
    const testObj = new TestClass();
    testObj.jsonProperty = ["John", "30"];
    const errors: ValidationError[] = await validate(testObj);
    expect(errors.length).toBe(0);
  });
});
