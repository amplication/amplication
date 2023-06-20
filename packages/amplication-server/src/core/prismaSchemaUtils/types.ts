import { ConcretePrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { registerEnumType } from "@nestjs/graphql";
import { JsonValue } from "type-fest";
import { EnumDataType } from "../../prisma";

export enum ErrorMessages {
  InvalidSchema = "Invalid schema",
  InvalidModelName = "Invalid model name",
  InvalidFieldName = "Invalid field name",
  ReservedWord = "Reserved word",
  NoModels = "No models",
  InvalidFKFieldName = "Invalid field name",
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

export type CreateBulkEntityFromSchemaImport = {
  id: string;
  name: string;
  displayName: string;
  pluralDisplayName: string;
  description: string | null;
  customAttributes: string;
  fields: CreateEntityFieldCommonProperties[];
};

export type CreateEntityFieldCommonProperties = {
  permanentId: string;
  name: string;
  displayName: string;
  description: string;
  dataType: EnumDataType;
  required: boolean;
  unique: boolean;
  searchable: boolean;
  properties: { [x: string]: JsonValue };
  customAttributes?: string;
  relatedFieldName?: string;
  relatedFieldDisplayName?: string;
  relatedFieldAllowMultipleSelection?: boolean;
};
