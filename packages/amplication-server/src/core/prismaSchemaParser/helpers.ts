import { Enum, Field, Func, Schema } from "@mrleebo/prisma-ast";
import pluralize from "pluralize";
import { sentenceCase } from "sentence-case";
import { isReservedName } from "../entity/reservedNames";
import {
  DEFAULT_ATTRIBUTE_NAME,
  ENUM_TYPE_NAME,
  ID_ATTRIBUTE_NAME,
  NOW_FUNCTION_NAME,
  UPDATED_AT_ATTRIBUTE_NAME,
} from "./constants";
import { EnumDataType } from "../../prisma";
import { ScalarType } from "prisma-schema-dsl-types";

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
      !attribute.startsWith("@id") &&
      !attribute.startsWith("@default(now())") &&
      !attribute.startsWith("@default(cuid())") &&
      !attribute.startsWith("@default(uuid())") &&
      !attribute.startsWith("@default(autoincrement())") &&
      !attribute.startsWith("@relation") &&
      !attribute.startsWith("@updatedAt") &&
      !attribute.startsWith("@unique") &&
      !attribute.startsWith("@relation")
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
    modelName = capitalizeFirstLetter(pluralize.singular(modelName));
  }
  // snake case models are mapped to pascal case
  if (modelName.includes("_")) {
    modelName = modelName.split("_").map(capitalizeFirstLetter).join("");
  }

  if (isReservedName(modelName.toLowerCase().trim())) {
    modelName = `${modelName}Model`;
  }

  // always make sure the model name is in pascal case
  modelName = capitalizeFirstLetter(modelName);
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
      // first, convert the entire string to lowercase
      fieldName = fieldName.toLowerCase();

      // then, convert any character (letter or digit) that follows an underscore to uppercase in order to get camel case
      fieldName = fieldName.replace(/_([a-z0-9])/g, (g) => g[1].toUpperCase());
    }

    // ensure the first letter is always lowercased (in case it was made uppercase by the previous step)
    fieldName = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);

    if (isReservedName(fieldName.toLowerCase().trim())) {
      fieldName = `${fieldName}Field`;
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

export function lookupField(field: Field) {
  const fieldLookupType = field.attributes?.some(
    (attribute) => attribute.name === "relation"
  );
  if (fieldLookupType) {
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
