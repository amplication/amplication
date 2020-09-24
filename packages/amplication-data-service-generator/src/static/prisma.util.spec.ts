import { mapArrayValuesToSetArrayValues } from "./prisma.util";

const EXAMPLE_VALUE = "EXAMPLE_VALUE";
const EXAMPLE_OTHER_VALUE = "EXAMPLE_OTHER_VALUE";
const EXAMPLE_KEY = "exampleKey";
const EXAMPLE_OTHER_KEY = "exampleOtherKey";
const EXAMPLE_OBJECT = {
  exampleObjectKey: "EXAMPLE_OBJECT_VALUE",
};

describe("mapArrayValuesToSetArrayValues", () => {
  test("it doesn't change empty object", () => {
    const object = {};
    expect(mapArrayValuesToSetArrayValues(object)).toEqual(object);
  });
  test("it doesn't object without array fields", () => {
    const object = { [EXAMPLE_KEY]: EXAMPLE_VALUE };
    expect(mapArrayValuesToSetArrayValues(object)).toEqual(object);
  });
  test("it changes object with single array field", () => {
    const value = [EXAMPLE_VALUE];
    const object = { [EXAMPLE_KEY]: value };
    expect(mapArrayValuesToSetArrayValues(object)).toEqual({
      [EXAMPLE_KEY]: {
        set: value,
      },
    });
  });
  test("it changes object with two array fields", () => {
    const value = [EXAMPLE_VALUE];
    const otherValue = [EXAMPLE_OTHER_VALUE];
    const object = { [EXAMPLE_KEY]: value, [EXAMPLE_OTHER_KEY]: otherValue };
    expect(mapArrayValuesToSetArrayValues(object)).toEqual({
      [EXAMPLE_KEY]: {
        set: value,
      },
      [EXAMPLE_OTHER_KEY]: { set: otherValue },
    });
  });
  test("it changes object with two array fields and non-array field", () => {
    const value = [EXAMPLE_VALUE];
    const otherValue = [EXAMPLE_OTHER_VALUE];
    const object = {
      [EXAMPLE_KEY]: value,
      [EXAMPLE_OTHER_KEY]: otherValue,
      exampleNonArrayKey: EXAMPLE_VALUE,
    };
    expect(mapArrayValuesToSetArrayValues(object)).toEqual({
      [EXAMPLE_KEY]: {
        set: value,
      },
      [EXAMPLE_OTHER_KEY]: { set: otherValue },
      exampleNonArrayKey: EXAMPLE_VALUE,
    });
  });
});
