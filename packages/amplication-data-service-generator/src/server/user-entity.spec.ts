import { EntityField, EnumDataType } from "../types";
import {
  getMissingAuthFields,
  InvalidDataTypeError,
  USER_AUTH_FIELDS,
  USER_NAME_FIELD,
} from "./user-entity";

describe("getMissingAuthFields", () => {
  const cases: Array<[string, EntityField[], EntityField[]]> = [
    ["No missing auth fields", USER_AUTH_FIELDS, []],
    [
      "One missing auth field",
      USER_AUTH_FIELDS.slice(0, -1),
      USER_AUTH_FIELDS.slice(-1),
    ],
  ];
  test.each(cases)("%s", (name, fields, expected) => {
    expect(getMissingAuthFields(fields)).toEqual(expected);
  });

  test("throws for invalid data type", () => {
    expect(() =>
      getMissingAuthFields([{ ...USER_NAME_FIELD, dataType: EnumDataType.Id }])
    ).toThrow(new InvalidDataTypeError([USER_NAME_FIELD]));
  });
});

describe("InvalidDataTypeError", () => {
  test("constructs correctly", () => {
    expect(new InvalidDataTypeError([USER_NAME_FIELD]).message).toEqual(
      `Invalid fields data types: ${USER_NAME_FIELD.name} data type should be ${USER_NAME_FIELD.dataType}`
    );
  });
});
