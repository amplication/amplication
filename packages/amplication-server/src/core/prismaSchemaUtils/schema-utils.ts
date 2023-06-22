import { Func } from "@mrleebo/prisma-ast";
import pluralize from "pluralize";
import { sentenceCase } from "sentence-case";
import { isReservedName } from "../entity/reservedNames";

export const idTypePropertyMap = {
  autoincrement: "AUTO_INCREMENT",
  cuid: "CUID",
  uuid: "UUID",
};

export const idTypePropertyMapByFieldType = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Int: "AUTO_INCREMENT",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  String: "CUID",
};

export function capitalizeFirstLetter(string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function isCamelCaseWithIdSuffix(string) {
  return /^[a-z]+([A-Z][a-z]*)*Id$/.test(string);
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
      !attribute.startsWith("unique") &&
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

  return fieldName.name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function formatDisplayName(displayName: string): string {
  return capitalizeFirstLetterOfEachWord(sentenceCase(displayName));
}
