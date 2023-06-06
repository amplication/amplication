import { Func } from "@mrleebo/prisma-ast";
import { registerEnumType } from "@nestjs/graphql";

export enum ErrorMessages {
  InvalidSchema = "INVALID_SCHEMA",
  NoModels = "NO_MODELS",
  NoEnums = "NO_ENUMS",
}

registerEnumType(ErrorMessages, {
  name: "ErrorMessages",
});

export enum ErrorLevel {
  Error = "ERROR",
  Warning = "WARNING",
}

registerEnumType(ErrorLevel, {
  name: "ErrorLevel",
});

export type SchemaEntityFields = {
  name: string;
  displayName: string;
  pluralDisplayName: string;
  pluralName: string;
  description: string | null;
  customAttributes: string[];
  fields: {
    name: string;
    displayName: string;
    description: string;
    dataType: string | Func;
    required: boolean;
    unique: boolean;
    searchable: boolean;
    properties: Record<string, unknown>;
    customAttributes: string[];
  }[];
};
