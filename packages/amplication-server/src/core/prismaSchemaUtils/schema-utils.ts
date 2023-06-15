import { Func } from "@mrleebo/prisma-ast";
import pluralize from "pluralize";
import { sentenceCase } from "sentence-case";

export const idTypePropertyMap = {
  autoincrement: { idType: "AUTO_INCREMENT" },
  cuid: { idType: "CUID" },
  uuid: { idType: "UUID" },
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

  // always make sure the model name is in pascal case
  modelName = capitalizeFirstLetter(modelName);
  return modelName;
}

export function formatFieldName(fieldName: string | Func): string {
  if (typeof fieldName === "string") {
    return fieldName.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  }

  return fieldName.name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function formatDisplayName(displayName: string): string {
  return capitalizeFirstLetterOfEachWord(sentenceCase(displayName));
}
