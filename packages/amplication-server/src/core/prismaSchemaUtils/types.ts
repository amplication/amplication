import { ConcretePrismaSchemaBuilder, Func } from "@mrleebo/prisma-ast";
import { registerEnumType } from "@nestjs/graphql";
import { JsonValue } from "type-fest";

export enum ErrorMessages {
  InvalidSchema = "Invalid schema",
  InvalidModelName = "Invalid model name",
  NoModels = "No models",
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

export type Operation = (
  builder: ConcretePrismaSchemaBuilder
) => ConcretePrismaSchemaBuilder;

export type CreateEntityInput = {
  name: string;
  displayName: string;
  pluralDisplayName: string;
  description: string | null;
  customAttributes: string;
};

export type CreateEntityFieldInput = {
  name: string;
  displayName: string;
  description: string;
  dataType: string | Func;
  required: boolean;
  unique: boolean;
  searchable: boolean;
  properties: { [x: string]: JsonValue };
  customAttributes: string;
};

export type CreateOneEntityFieldArgs = {
  data: CreateEntityFieldInput;
  relatedFieldName?: string;
  relatedFieldDisplayName?: string;
};

export type SchemaEntityFields = {
  name: string;
  displayName: string;
  pluralDisplayName: string;
  description: string | null;
  customAttributes: string;
  fields: CreateOneEntityFieldArgs[];
};
