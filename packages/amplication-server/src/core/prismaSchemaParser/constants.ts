export const MODEL_TYPE_NAME = "model";
export const FIELD_TYPE_NAME = "field";
export const ENUM_TYPE_NAME = "enum";
export const ENUMERATOR_TYPE_NAME = "enumerator";
export const ATTRIBUTE_TYPE_NAME = "attribute";

export const KEY_VALUE_ARG_TYPE_NAME = "keyValue";
export const ARRAY_ARG_TYPE_NAME = "array";
export const FUNCTION_ARG_TYPE_NAME = "function";
export const OBJECT_KIND_NAME = "object";

export const MAP_ATTRIBUTE_NAME = "map";
export const INDEX_ATTRIBUTE_NAME = "index";
export const DEFAULT_ATTRIBUTE_NAME = "default";
export const UNIQUE_ATTRIBUTE_NAME = "unique";
export const UPDATED_AT_ATTRIBUTE_NAME = "updatedAt";
export const ID_ATTRIBUTE_NAME = "id";
export const RELATION_ATTRIBUTE_NAME = "relation";

export const ID_FIELD_NAME = "id";
export const NOW_FUNCTION_NAME = "now";
export const ARG_KEY_FIELD_NAME = "fields";

export const ID_TYPE_CUID = "CUID";
export const ID_TYPE_UUID = "UUID";
export const ID_TYPE_AUTOINCREMENT = "AUTO_INCREMENT";
export const INT_TYPE = "INT";
export const BIG_INT_TYPE = "BIG_INT";
export const DECIMAL_TYPE = "DECIMAL";
export const FLOAT_TYPE = "FLOAT";

export const idTypePropertyMap = {
  autoincrement: ID_TYPE_AUTOINCREMENT,
  cuid: ID_TYPE_CUID,
  uuid: ID_TYPE_UUID,
};

export const wholeNumberMap = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Int: INT_TYPE,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BigInt: BIG_INT_TYPE,
};

export const decimalNumberMap = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Float: FLOAT_TYPE,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Decimal: DECIMAL_TYPE,
};

export const idTypePropertyMapByFieldType = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Int: ID_TYPE_AUTOINCREMENT,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  String: ID_TYPE_CUID,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BigInt: ID_TYPE_AUTOINCREMENT,
};
