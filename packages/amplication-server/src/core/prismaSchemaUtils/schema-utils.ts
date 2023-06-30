import {
  Enum,
  Field,
  Func,
  KeyValue,
  Model,
  RelationArray,
  Schema,
} from "@mrleebo/prisma-ast";
import pluralize from "pluralize";
import { sentenceCase } from "sentence-case";
import { isReservedName } from "../entity/reservedNames";
import {
  ARG_KEY_FIELD_NAME,
  DEFAULT_ATTRIBUTE_NAME,
  ENUM_TYPE_NAME,
  ID_ATTRIBUTE_NAME,
  ID_TYPE_AUTOINCREMENT,
  ID_TYPE_CUID,
  ID_TYPE_UUID,
  NOW_FUNCTION_NAME,
  RELATION_ATTRIBUTE_NAME,
  UPDATED_AT_ATTRIBUTE_NAME,
} from "./constants";
import { EnumDataType } from "../../prisma";
import { ScalarType } from "prisma-schema-dsl-types";
import { ExistingEntitySelect, Mapper } from "./types";

export const idTypePropertyMap = {
  autoincrement: ID_TYPE_AUTOINCREMENT,
  cuid: ID_TYPE_CUID,
  uuid: ID_TYPE_UUID,
};

export const idTypePropertyMapByFieldType = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Int: ID_TYPE_AUTOINCREMENT,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  String: ID_TYPE_CUID,
};

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
  if (typeof fieldName === "string") {
    fieldName = fieldName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

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
  const fieldOptionSetType = enumList.find(
    (enumItem: Enum) => enumItem.name === field.fieldType
  );
  if (fieldOptionSetType) {
    return EnumDataType.OptionSet;
  }
}

export function multiSelectOptionSetField(schema: Schema, field: Field) {
  const enumList = schema.list.filter((item) => item.type === ENUM_TYPE_NAME);
  const isMultiSelect = field.array || false;
  const fieldOptionSetType = enumList.find(
    (enumItem: Enum) => enumItem.name === field.fieldType && isMultiSelect
  );
  if (fieldOptionSetType) {
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

export function findFkFieldNameOnAnnotatedField(field: Field): string {
  const relationAttribute = field.attributes?.find(
    (attr) => attr.name === RELATION_ATTRIBUTE_NAME
  );

  if (!relationAttribute) {
    throw new Error(`Missing relation attribute on field ${field.name}`);
  }

  const fieldsArgs = relationAttribute.args?.find(
    (arg) => (arg.value as KeyValue).key === ARG_KEY_FIELD_NAME
  );

  if (!fieldsArgs) {
    throw new Error(
      `Missing fields attribute on relation attribute on field ${field.name}`
    );
  }

  const fieldsArgsValues = (
    (fieldsArgs.value as KeyValue).value as RelationArray
  ).args;

  if (fieldsArgsValues.length > 1) {
    throw new Error(
      `Relation attribute on field ${field.name} has more than one field, which is not supported`
    );
  }

  return fieldsArgsValues[0];
}

export function handleModelNamesCollision(
  modelList: Model[],
  existingEntities: ExistingEntitySelect[],
  mapper: Mapper,
  formattedModelName: string
): string {
  const modelSuffix = "Model";
  let isFormattedModelNameAlreadyTaken = false;
  let newName = formattedModelName;
  let counter = 0;

  do {
    isFormattedModelNameAlreadyTaken = modelList.some(
      (modelFromList) => modelFromList.name === newName
    );

    isFormattedModelNameAlreadyTaken ||= existingEntities.some(
      (existingEntity) => existingEntity.name === newName
    );

    isFormattedModelNameAlreadyTaken ||= Object.values(mapper.modelNames).some(
      (model) => model.newName === newName
    );

    if (isFormattedModelNameAlreadyTaken) {
      newName = `${formattedModelName}${modelSuffix}${counter ? counter : ""}`;
      counter++;
    }
  } while (isFormattedModelNameAlreadyTaken);

  return newName;
}
