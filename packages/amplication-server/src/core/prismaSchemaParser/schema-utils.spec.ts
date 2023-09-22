import {
  findFkFieldNameOnAnnotatedField,
  handleModelNamesCollision,
  createOneEntityFieldCommonProperties,
  prepareModelAttributes,
  prepareFieldAttributes,
  handleEnumMapAttribute,
} from "./schema-utils";
import { ARG_KEY_FIELD_NAME, RELATION_ATTRIBUTE_NAME } from "./constants";
import {
  Attribute,
  BlockAttribute,
  Enum,
  Field,
  Model,
} from "@mrleebo/prisma-ast";
import { Mapper } from "./types";
import { EnumDataType } from "../../enums/EnumDataType";
import { EnumActionLogLevel } from "../action/dto";
import { ActionContext } from "../userAction/types";

describe("schema-utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOneEntityFieldCommonProperties", () => {
    const mockAttributes = [
      {
        type: "attribute",
        name: "map",
        kind: "field",
        args: [
          {
            type: "attributeArgument",
            value: '"mock_field"',
          },
        ],
      },
    ] as unknown as Attribute[];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should create properties for a standard field", () => {
      const field = {
        name: "testField",
        optional: false,
        attributes: mockAttributes,
      } as unknown as Field;
      const dataType = EnumDataType.SingleLineText;

      const result = createOneEntityFieldCommonProperties(field, dataType);

      expect(result).toEqual({
        permanentId: expect.any(String),
        name: "testField",
        displayName: "Test Field",
        dataType: dataType,
        required: true,
        unique: false,
        searchable: true,
        description: "",
        properties: {},
        customAttributes: '@map("mock_field")',
      });
    });

    it("should handle unique attribute", () => {
      const field = {
        name: "testField",
        optional: false,
        attributes: [{ name: "unique" }],
      } as unknown as Field;
      const dataType = EnumDataType.SingleLineText;

      const result = createOneEntityFieldCommonProperties(field, dataType);

      expect(result.unique).toEqual(true);
    });

    it("should handle optional field", () => {
      const field = {
        name: "testField",
        optional: true,
        attributes: [],
      } as unknown as Field;
      const dataType = EnumDataType.SingleLineText;

      const result = createOneEntityFieldCommonProperties(field, dataType);

      expect(result.required).toEqual(false);
    });

    it("should mark all field as searchable", () => {
      const field = {
        name: "testField",
        optional: false,
        attributes: [],
      } as unknown as Field;
      const dataType = EnumDataType.Id;

      const result = createOneEntityFieldCommonProperties(field, dataType);

      expect(result.searchable).toEqual(true);
    });

    it("should add custom attributes for non-Lookup field", () => {
      const field = {
        name: "testField",
        optional: false,
        attributes: mockAttributes,
      } as unknown as Field;
      const dataType = EnumDataType.SingleLineText;

      const result = createOneEntityFieldCommonProperties(field, dataType);

      expect(result.customAttributes).toEqual('@map("mock_field")');
    });
  });

  describe("prepareModelAttributes", () => {
    it("should return an array of model attributes as strings", () => {
      const mockAttributes = [
        { name: "mockModelAttribute1", args: [] },
        { name: "mockModelAttribute2", args: [] },
      ] as unknown as BlockAttribute[];

      const result = prepareModelAttributes(mockAttributes);

      expect(result).toEqual([
        "@@mockModelAttribute1()",
        "@@mockModelAttribute2()",
      ]);
    });

    it("should return an array of model attributes as strings with args", () => {
      const mockAttributes = [
        {
          type: "attribute",
          name: "mockModelAttribute1",
          kind: "object",
          args: [
            {
              type: "attributeArgument",
              value: {
                type: "array",
                args: ["mockArg"],
              },
            },
            {
              type: "attributeArgument",
              value: {
                type: "keyValue",
                key: "map",
                value: '"mockArg"',
              },
            },
          ],
        },
        { name: "mockModelAttribute2", args: [] },
      ] as unknown as BlockAttribute[];

      const result = prepareModelAttributes(mockAttributes);

      expect(result).toEqual([
        '@@mockModelAttribute1([mockArg], map: "mockArg")',
        "@@mockModelAttribute2()",
      ]);
    });
  });

  describe("prepareFieldAttributes", () => {
    it("should return an array of field attributes as strings", () => {
      const mockAttributes = [
        { name: "mockFieldAttribute1", args: [] },
        {
          name: "mockFieldAttribute2",
          args: [
            {
              type: "attributeArgument",
              value: {
                type: "function",
                name: "dbgenerated",
                params: ['"uuid_generate_v4()"'],
              },
            },
          ],
        },
      ] as unknown as Attribute[];

      const result = prepareFieldAttributes(mockAttributes);

      expect(result).toEqual([
        "@mockFieldAttribute1",
        '@mockFieldAttribute2(dbgenerated("uuid_generate_v4()"))',
      ]);
    });

    it("should return a proper default field attribute with a default value as a function", () => {
      const mockAttributes = [
        {
          type: "attribute",
          name: "default",
          kind: "field",
          args: [
            {
              type: "attributeArgument",
              value: {
                type: "function",
                name: "now",
              },
            },
          ],
        },
      ] as unknown as Attribute[];

      const result = prepareFieldAttributes(mockAttributes);

      expect(result).toEqual(["@default(now())"]);
    });

    it("should return a proper default field attribute with a default value", () => {
      const mockAttributes = [
        {
          type: "attribute",
          name: "default",
          kind: "field",
          args: [
            {
              type: "attributeArgument",
              value: "false",
            },
          ],
        },
      ] as unknown as Attribute[];

      const result = prepareFieldAttributes(mockAttributes);

      expect(result).toEqual(["@default(false)"]);
    });

    it("should return an array of relation field attribute", () => {
      const mockAttributes = [
        {
          type: "attribute",
          name: "relation",
          kind: "field",
          args: [
            {
              type: "attributeArgument",
              value: {
                type: "keyValue",
                key: "fields",
                value: {
                  type: "array",
                  args: ["user_id"],
                },
              },
            },
            {
              type: "attributeArgument",
              value: {
                type: "keyValue",
                key: "references",
                value: {
                  type: "array",
                  args: ["id"],
                },
              },
            },
            {
              type: "attributeArgument",
              value: {
                type: "keyValue",
                key: "onDelete",
                value: "Cascade",
              },
            },
            {
              type: "attributeArgument",
              value: {
                type: "keyValue",
                key: "map",
                value: '"mockRelationValue"',
              },
            },
          ],
        },
        { name: "mockFieldAttribute2", args: [] },
      ] as unknown as Attribute[];

      const result = prepareFieldAttributes(mockAttributes);

      expect(result).toEqual([
        '@relation(fields: [user_id], references: [id], onDelete: Cascade, map: "mockRelationValue")',
        "@mockFieldAttribute2",
      ]);
    });

    it("should correctly format args that are arrays of functions", () => {
      const mockAttributes = [
        {
          type: "attribute",
          name: "mockModelAttribute",
          kind: "object",
          args: [
            {
              type: "attributeArgument",
              value: {
                type: "array",
                args: [
                  {
                    type: "function",
                    name: "value_1",
                    params: [
                      {
                        type: "keyValue",
                        key: "ops",
                        value: "Int4BloomOps",
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: "attributeArgument",
              value: {
                type: "keyValue",
                key: "type",
                value: "Brin",
              },
            },
          ],
        },
      ] as unknown as BlockAttribute[];

      const result = prepareModelAttributes(mockAttributes);

      expect(result).toEqual([
        "@@mockModelAttribute([value_1(ops: Int4BloomOps)], type: Brin)",
      ]);
    });
  });

  describe("findFkFieldNameOnAnnotatedField", () => {
    it("should throw error if no fields attribute is found on relation attribute", () => {
      const field = {
        name: "testField",
        attributes: [
          {
            name: RELATION_ATTRIBUTE_NAME,
            args: [],
          },
        ],
      } as unknown as Field;

      expect(() => {
        findFkFieldNameOnAnnotatedField(field);
      }).toThrow(
        `Missing fields attribute on relation attribute on field ${field.name}`
      );
    });

    it("should throw error if relation attribute has more than one field", () => {
      const field = {
        name: "testField",
        attributes: [
          {
            name: RELATION_ATTRIBUTE_NAME,
            args: [
              {
                value: {
                  key: ARG_KEY_FIELD_NAME,
                  value: { args: ["field1", "field2"] },
                },
              },
            ],
          },
        ],
      } as unknown as Field;

      expect(() => {
        findFkFieldNameOnAnnotatedField(field);
      }).toThrow(
        `Relation attribute on field ${field.name} has more than one field, which is not supported`
      );
    });

    it("should return the field name when everything is correct", () => {
      const field = {
        name: "testField",
        attributes: [
          {
            name: RELATION_ATTRIBUTE_NAME,
            args: [
              {
                value: {
                  key: ARG_KEY_FIELD_NAME,
                  value: { args: ["correctField"] },
                },
              },
            ],
          },
        ],
      } as unknown as Field;

      const result = findFkFieldNameOnAnnotatedField(field);
      expect(result).toBe("correctField");
    });
  });

  describe("handleModelNamesCollision", () => {
    const modelList = [
      { name: "Model1" },
      { name: "Model2" },
    ] as unknown as Model[];
    const existingEntities = [{ name: "Entity1" }, { name: "Entity2" }];
    const mapper = {
      modelNames: {
        name1: { newName: "NewName1" },
        name2: { newName: "NewName2" },
      },
    } as unknown as Mapper;

    it("should return the original name if there is no collision", () => {
      const result = handleModelNamesCollision(
        modelList,
        existingEntities,
        mapper,
        "OriginalName"
      );
      expect(result).toBe("OriginalName");
    });

    it("should return the name with suffix if the original name collides with model names", () => {
      const result = handleModelNamesCollision(
        modelList,
        existingEntities,
        mapper,
        "Model1"
      );
      expect(result).toBe("Model1Model");
    });

    it("should return the name with suffix if the original name collides with existing entities", () => {
      const result = handleModelNamesCollision(
        modelList,
        existingEntities,
        mapper,
        "Entity1"
      );
      expect(result).toBe("Entity1Model");
    });

    it("should return the name with suffix if the original name collides with names in the mapper", () => {
      const result = handleModelNamesCollision(
        modelList,
        existingEntities,
        mapper,
        "NewName1"
      );
      expect(result).toBe("NewName1Model");
    });
  });

  describe("handleEnumMapAttribute", () => {
    jest.clearAllMocks();

    let actionContext: ActionContext;

    beforeEach(() => {
      actionContext = {
        onEmitUserActionLog: jest.fn(),
      };
    });

    it("should return array of options and log info message when only enumerators are present", () => {
      const enumOfTheField = {
        name: "TestEnum",
        enumerators: [
          {
            type: "enumerator",
            name: "enumerator1",
          },
          {
            type: "enumerator",
            name: "enumerator2",
          },
        ],
      } as unknown as Enum;

      const result = handleEnumMapAttribute(enumOfTheField, actionContext);

      expect(result).toEqual([
        { label: "enumerator1", value: "enumerator1" },
        { label: "enumerator2", value: "enumerator2" },
      ]);

      expect(actionContext.onEmitUserActionLog).toHaveBeenCalledTimes(2);
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        1,
        "The option 'enumerator1' has been created in the enum 'TestEnum'",
        EnumActionLogLevel.Info
      );
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        2,
        "The option 'enumerator2' has been created in the enum 'TestEnum'",
        EnumActionLogLevel.Info
      );
    });

    it("should log a warning and skip when the enumerator is an attribute name map and kind object", () => {
      const enumOfTheField = {
        name: "TestEnum",
        enumerators: [
          {
            type: "attribute",
            name: "map",
            kind: "object",
          },
        ],
      } as unknown as Enum;

      const result = handleEnumMapAttribute(enumOfTheField, actionContext);

      expect(result).toEqual([]);

      expect(actionContext.onEmitUserActionLog).toHaveBeenCalledTimes(1);
      expect(actionContext.onEmitUserActionLog).toHaveBeenNthCalledWith(
        1,
        "The enum 'TestEnum' has been created, but it has not been mapped. Mapping an enum name is not supported.",
        EnumActionLogLevel.Warning
      );
    });

    it("should NOT log a warning, and skip when the enumerator is an attribute name map and kind field", () => {
      const enumOfTheField = {
        name: "TestEnum",
        enumerators: [
          {
            type: "attribute",
            name: "map",
            kind: "field",
          },
        ],
      } as unknown as Enum;

      const result = handleEnumMapAttribute(enumOfTheField, actionContext);

      expect(result).toEqual([]);
      expect(actionContext.onEmitUserActionLog).toHaveBeenCalledTimes(0);
    });
  });
});
