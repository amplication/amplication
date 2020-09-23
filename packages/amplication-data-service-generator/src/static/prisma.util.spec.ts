import { mapArrayValuesToSetArrayValues } from "./prisma.util";

describe("mapArrayValuesToSetArrayValues", () => {
  test("it doesn't change empty object", () => {
    const object = {};
    expect(mapArrayValuesToSetArrayValues(object)).toEqual(object);
  });
  test("it doesn't object without array fields", () => {
    const object = { exampleKey: "EXAMPLE_VALUE" };
    expect(mapArrayValuesToSetArrayValues(object)).toEqual(object);
  });
  test("it changes object with single array field", () => {
    const value = ["EXAMPLE_VALUE"];
    const object = { exampleKey: value };
    expect(mapArrayValuesToSetArrayValues(object)).toEqual({
      exampleKey: {
        set: value,
      },
    });
  });
  test("it changes object with two array fields", () => {
    const value = ["EXAMPLE_VALUE"];
    const otherValue = ["EXAMPLE_OTHER_VALUE"];
    const object = { exampleKey: value, exampleOtherKey: otherValue };
    expect(mapArrayValuesToSetArrayValues(object)).toEqual({
      exampleKey: {
        set: value,
      },
      exampleOtherKey: { set: otherValue },
    });
  });
  test("it changes object with two array fields and non-array field", () => {
    const value = ["EXAMPLE_VALUE"];
    const otherValue = ["EXAMPLE_OTHER_VALUE"];
    const exampleNonArrayValue = "EXAMPLE_NON_ARRAY_VALUE";
    const object = {
      exampleKey: value,
      exampleOtherKey: otherValue,
      exampleNonArrayKey: exampleNonArrayValue,
    };
    expect(mapArrayValuesToSetArrayValues(object)).toEqual({
      exampleKey: {
        set: value,
      },
      exampleOtherKey: { set: otherValue },
      exampleNonArrayKey: exampleNonArrayValue,
    });
  });
});
