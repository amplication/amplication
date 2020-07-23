/**
 * Prisma's Schema data source provider
 * @see https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema/data-sources#fields
 */
export enum EnumPrismaDataSourceProvider {
  PostgreSQL = "postgresql",
  MySQL = "mysql",
  SQLite = "sqlite",
}

/**
 * Prisma's Schema data source
 * @see https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema/data-sources
 */
export type PrismaDataSource = {
  name: string;
  provider: EnumPrismaDataSourceProvider;
  url: string;
};

/**
 * Prisma's data model scalar types
 * @see https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema/data-model#scalar-types
 */
export enum EnumPrismaScalarType {
  /** Variable length text */
  String = "String",
  /** True or false value */
  Boolean = "Boolean",
  /** Integer value */
  Int = "Int",
  /** Floating point number */
  Float = "Float",
  /** Timestamp */
  DateTime = "DateTime",
  /** JSON */
  Json = "Json",
}

/** @todo share with server */
export enum EnumDataType {
  singleLineText = "singleLineText",
  multiLineText = "multiLineText",
  email = "email",
  state = "state",
  autoNumber = "autoNumber",
  wholeNumber = "wholeNumber",
  dateTime = "dateTime",
  decimalNumber = "decimalNumber",
  file = "file",
  image = "image",
  /** @todo */
  //   lookup = "lookup",
  //   multiSelectOptionSet = "multiSelectOptionSet",
  //   optionSet = "optionSet",
  //   twoOptions = "twoOptions",
  boolean = "boolean",
  uniqueId = "uniqueId",
  geographicAddress = "geographicAddress",
}

export type Field = {
  name: string;
  dataType: string;
  properties: Object;
  required: boolean;
};

export type Entity = {
  name: string;
  fields: Field[];
};
