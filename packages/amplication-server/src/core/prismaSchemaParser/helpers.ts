import { Enum, Field, Func, Model, Schema } from "@mrleebo/prisma-ast";
import pluralize from "pluralize";
import { sentenceCase } from "sentence-case";
import { isReservedName } from "../entity/reservedNames";
import {
  DEFAULT_ATTRIBUTE_NAME,
  ENUM_TYPE_NAME,
  ID_ATTRIBUTE_NAME,
  MODEL_TYPE_NAME,
  NOW_FUNCTION_NAME,
  UPDATED_AT_ATTRIBUTE_NAME,
  idTypePropertyMapByPrismaFieldType,
} from "./constants";
import { EnumDataType } from "../../prisma";
import { ScalarType } from "prisma-schema-dsl-types";
import { camelCase, upperFirst } from "lodash";
import { Mapper } from "./types";

export function capitalizeFirstLetter(string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeFirstLetterOfEachWord(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function filterOutAmplicationAttributes(attributes): string[] {
  return attributes.filter(
    (attribute) =>
      !attribute.startsWith("@default(now())") &&
      !attribute.startsWith("@updatedAt") &&
      !attribute.startsWith("@unique") &&
      !attribute.startsWith("@relation") &&
      !attribute.startsWith("@db.ObjectId")
  );
}

/**
 * make sure the model name is in pascal case, singular and without underscores
 * @param modelName - model name
 * @returns - the valid model name
 */
export function formatModelName(modelName: string): string {
  // plural models are mapped to singular
  if (pluralize.isPlural(modelName)) {
    modelName = pluralize.singular(modelName);
  }
  // snake case models are mapped to pascal case with the capitalizeFirstLetter helper function in order to know the separation between words
  if (modelName.includes("_")) {
    modelName = modelName.split("_").map(capitalizeFirstLetter).join("");
  }

  if (isReservedName(modelName.toLowerCase().trim())) {
    modelName = `${modelName}Model`;
  }

  // always make sure the model name is in pascal case
  modelName = upperFirst(camelCase(modelName));
  return modelName;
}

export function formatFieldName(fieldName: string | Func): string {
  if (!fieldName) {
    throw new Error("Field name is required");
  }

  if (typeof fieldName === "string") {
    if (fieldName.trim().length === 0) {
      throw new Error("Field name cannot be empty");
    }

    const isCamelCase = /^[a-z][A-Za-z0-9]*$/.test(fieldName);

    if (!isCamelCase) {
      fieldName = camelCase(fieldName);
    }

    if (isReservedName(fieldName.toLowerCase().trim())) {
      fieldName = `${camelCase(fieldName)}Field`;
    }

    return fieldName;
  }

  return fieldName.name;
}

export function formatDisplayName(displayName: string): string {
  return capitalizeFirstLetterOfEachWord(sentenceCase(displayName));
}

export function idField(field: Field) {
  const fieldIdType = field.attributes?.some(
    (attribute) => attribute.name === ID_ATTRIBUTE_NAME
  );
  if (fieldIdType) {
    return EnumDataType.Id;
  }
}

export function isValidIdFieldType(fieldType: string) {
  return idTypePropertyMapByPrismaFieldType.hasOwnProperty(fieldType);
}

export function lookupField(schema: Schema, field: Field) {
  const models = schema.list.filter(
    (item) => item.type === MODEL_TYPE_NAME
  ) as Model[];

  const isFieldTypeIsModel = models.some(
    (modelItem: Model) =>
      formatModelName(modelItem.name) ===
      formatModelName(field.fieldType as string)
  );

  if (isFieldTypeIsModel) {
    return EnumDataType.Lookup;
  }
}

export function createAtField(field: Field) {
  const createdAtDefaultAttribute = field.attributes?.find(
    (attribute) => attribute.name === "default"
  );

  const createdAtNowArg = createdAtDefaultAttribute?.args?.some(
    (arg) => (arg.value as Func).name === "now"
  );

  if (createdAtDefaultAttribute && createdAtNowArg) {
    return EnumDataType.CreatedAt;
  }
}

export function updateAtField(field: Field) {
  const updatedAtAttribute = field.attributes?.some(
    (attribute) => attribute.name === UPDATED_AT_ATTRIBUTE_NAME
  );

  const updatedAtDefaultAttribute = field.attributes?.find(
    (attribute) => attribute.name === DEFAULT_ATTRIBUTE_NAME
  );

  const updatedAtNowArg = updatedAtDefaultAttribute?.args?.some(
    (arg) => (arg.value as Func).name === NOW_FUNCTION_NAME
  );

  if (updatedAtAttribute || (updatedAtDefaultAttribute && updatedAtNowArg)) {
    return EnumDataType.UpdatedAt;
  }
}

export function optionSetField(schema: Schema, field: Field) {
  const enumList = schema.list.filter((item) => item.type === ENUM_TYPE_NAME);
  const isMultiSelect = field.array || false;
  const fieldOptionSetType = enumList.find(
    (enumItem: Enum) => enumItem.name === field.fieldType
  );
  if (fieldOptionSetType && !isMultiSelect) {
    return EnumDataType.OptionSet;
  }
}

export function multiSelectOptionSetField(schema: Schema, field: Field) {
  const enumList = schema.list.filter((item) => item.type === ENUM_TYPE_NAME);
  const isMultiSelect = field.array || false;
  const fieldOptionSetType = enumList.find(
    (enumItem: Enum) => enumItem.name === field.fieldType
  );
  if (fieldOptionSetType && isMultiSelect) {
    return EnumDataType.MultiSelectOptionSet;
  }
}

export function singleLineTextField(field: Field) {
  if (field.fieldType === ScalarType.String) {
    return EnumDataType.SingleLineText;
  }
}

export function wholeNumberField(field: Field) {
  const isIntField = field.fieldType === ScalarType.Int;
  const isBigIntField = field.fieldType === ScalarType.BigInt;
  if (isIntField || isBigIntField) {
    return EnumDataType.WholeNumber;
  }
}

export function decimalNumberField(field: Field) {
  const isFloatField = field.fieldType === ScalarType.Float;
  const isDecimalField = field.fieldType === ScalarType.Decimal;
  if (isFloatField || isDecimalField) {
    return EnumDataType.DecimalNumber;
  }
}

export function booleanField(field: Field) {
  if (field.fieldType === ScalarType.Boolean) {
    return EnumDataType.Boolean;
  }
}

export function dateTimeField(field: Field) {
  if (field.fieldType === ScalarType.DateTime) {
    return EnumDataType.DateTime;
  }
}

export function jsonField(field: Field) {
  if (field.fieldType === ScalarType.Json) {
    return EnumDataType.Json;
  }
}

export function findOriginalModelName(
  mapper: Mapper,
  modelName: string
): string {
  return (
    Object.values(mapper.modelNames).find((item) => item.newName === modelName)
      ?.originalName || modelName
  );
}

export function findOriginalFieldName(
  mapper: Mapper,
  fieldName: string
): string {
  for (const [, fields] of Object.entries(mapper.fieldNames)) {
    const field = Object.values(fields).find(
      (value) => value.newName === fieldName
    );
    if (field) {
      return field.originalName;
    }
  }
  return fieldName;
}
