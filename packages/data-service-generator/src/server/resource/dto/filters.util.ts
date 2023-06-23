import { builders } from "ast-types";

export enum EnumScalarFiltersTypes {
  Json = "Json",
  JsonNullable = "JsonNullable",
  String = "String",
  StringNullable = "StringNullable",
  Int = "Int",
  IntNullable = "IntNullable",
  Float = "Float",
  FloatNullable = "FloatNullable",
  Boolean = "Boolean",
  BooleanNullable = "BooleanNullable",
  DateTime = "DateTime",
  DateTimeNullable = "DateTimeNullable",
  Decimal = "Decimal",
  DecimalNullable = "DecimalNullable",
  BigInt = "BigInt",
  BigIntNullable = "BigIntNullable",
}

export const SCALAR_FILTER_TO_MODULE_AND_TYPE = Object.fromEntries(
  Object.values(EnumScalarFiltersTypes).map((filter) => {
    return [
      filter,
      {
        module: `../../util/${filter}Filter`,
        type: builders.identifier(`${filter}Filter`),
      },
    ];
  })
);
