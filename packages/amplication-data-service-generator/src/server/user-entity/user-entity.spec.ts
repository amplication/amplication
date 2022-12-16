import { EntityField, EnumDataType } from "@amplication/code-gen-types";
import DsgContext from "../../dsg-context";
import { getMissingAuthFields, InvalidDataTypeError } from "./user-entity";

describe("getMissingAuthFields", () => {
  const { userNameField, userAuthField } = DsgContext.getInstance;
  const cases: Array<[string, EntityField[], EntityField[]]> = [
    ["No missing auth fields", userAuthField, []],
    [
      "One missing auth field",
      userAuthField.slice(0, -1),
      userAuthField.slice(-1),
    ],
  ];
  test.each(cases)("%s", (name, fields, expected) => {
    expect(getMissingAuthFields(fields)).toEqual(expected);
  });

  test("throws for invalid data type", () => {
    expect(() =>
      getMissingAuthFields([{ ...userNameField, dataType: EnumDataType.Id }])
    ).toThrow(new InvalidDataTypeError([userNameField]));
  });
});

describe("InvalidDataTypeError", () => {
  const { userNameField } = DsgContext.getInstance;

  test("constructs correctly", () => {
    expect(new InvalidDataTypeError([userNameField]).message).toEqual(
      `Invalid fields data types: ${userNameField.name} data type should be ${userNameField.dataType}`
    );
  });
});
