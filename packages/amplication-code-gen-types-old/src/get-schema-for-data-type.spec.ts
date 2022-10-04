import * as models from "./models";
import { getSchemaForDataType } from "./get-schema-for-data-type";

const DATA_TYPES = Object.keys(models.EnumDataType) as Array<
  keyof typeof models.EnumDataType
>;

describe("getSchemaForDataType", () => {
  test.each(DATA_TYPES)("getSchemaForDataType(EnumDataType.%s)", (dataType) => {
    expect(getSchemaForDataType(models.EnumDataType[dataType])).toBeDefined();
  });
});
