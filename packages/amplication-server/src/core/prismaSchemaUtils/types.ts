import { ConcretePrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { registerEnumType } from "@nestjs/graphql";
import { CreateBulkEntitiesInput } from "../entity/entity.service";
import { ErrorMessage } from "./ErrorMessages";

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

export type ConvertPrismaSchemaForImportObjectsResponse = {
  preparedEntitiesWithFields: CreateBulkEntitiesInput[];
  errors: ErrorMessage[] | null;
};
