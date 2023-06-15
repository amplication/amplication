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
  id: string;
  name: string;
  displayName: string;
  pluralDisplayName: string;
  description: string | null;
  customAttributes: string;
  fields: CreateEntityFieldInput[];
};

export type CreateEntityFieldInput = {
  permanentId: string;
  name: string;
  displayName: string;
  description: string;
  dataType: string | Func;
  required: boolean;
  unique: boolean;
  searchable: boolean;
  properties: { [x: string]: JsonValue };
  customAttributes?: string;
};
