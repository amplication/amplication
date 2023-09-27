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

export const ID_DEFAULT_VALUE_CUID = "cuid";
export const ID_DEFAULT_VALUE_UUID = "uuid";
export const ID_DEFAULT_VALUE_AUTO_INCREMENT = "autoincrement";

export const ID_DEFAULT_VALUE_CUID_FUNCTION = "cuid()";
export const ID_DEFAULT_VALUE_UUID_FUNCTION = "uuid()";
export const ID_DEFAULT_VALUE_AUTO_INCREMENT_FUNCTION = "autoincrement()";

export const ID_TYPE_CUID = "CUID";
export const ID_TYPE_UUID = "UUID";
export const ID_TYPE_AUTO_INCREMENT = "AUTO_INCREMENT";
export const ID_TYPE_AUTO_INCREMENT_BIG_INT = "AUTO_INCREMENT_BIG_INT";

export const PRISMA_TYPE_STRING = "String";
export const PRISMA_TYPE_INT = "Int";
export const PRISMA_TYPE_BIG_INT = "BigInt";

export enum WholeNumberType {
  Int = "INT",
  BigInt = "BIG_INT",
}

export enum DecimalNumberType {
  Float = "FLOAT",
  Decimal = "DECIMAL",
}

export const idTypePropertyMapByPrismaFieldType = {
  [PRISMA_TYPE_INT]: ID_TYPE_AUTO_INCREMENT,
  [PRISMA_TYPE_STRING]: ID_TYPE_CUID,
  [PRISMA_TYPE_BIG_INT]: ID_TYPE_AUTO_INCREMENT_BIG_INT,
};

export const prismaIdTypeToDefaultIdType = {
  [PRISMA_TYPE_INT]: ID_DEFAULT_VALUE_AUTO_INCREMENT_FUNCTION,
  [PRISMA_TYPE_STRING]: ID_DEFAULT_VALUE_CUID_FUNCTION,
  [PRISMA_TYPE_BIG_INT]: ID_DEFAULT_VALUE_AUTO_INCREMENT_FUNCTION,
};
