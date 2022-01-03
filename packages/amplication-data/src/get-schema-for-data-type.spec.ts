import { getSchemaForDataType } from "./get-schema-for-data-type";
import { DATA_TYPES } from "./constants";
import { EnumDataType } from "./models";

describe("getSchemaForDataType", () => {
  test.each(DATA_TYPES)("getSchemaForDataType(EnumDataType.%s)", (dataType) => {
    expect(getSchemaForDataType(EnumDataType[dataType])).toBeDefined();
  });
});
