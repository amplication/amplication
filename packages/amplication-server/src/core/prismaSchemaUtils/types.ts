import { ConcretePrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { registerEnumType } from "@nestjs/graphql";

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
