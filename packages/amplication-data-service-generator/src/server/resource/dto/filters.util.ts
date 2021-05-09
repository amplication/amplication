import { builders } from "ast-types";

export enum EnumScalarFiltersTypes {
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
