import { ConcretePrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { CreateBulkEntitiesInput } from "../entity/entity.service";
import { ActionLog } from "../action/dto";

export type PrepareOperation = (
  prepareOperationIO: PrepareOperationIO
) => PrepareOperationIO;

export type PrepareOperationIO = {
  builder: ConcretePrismaSchemaBuilder;
  mapper: Mapper;
  log: ActionLog[];
};

export type Mapper = {
  modelNames: Record<string, MapperItem>;
  fieldNames: Record<string, MapperItem>;
  fieldTypes: Record<string, MapperItem>;
  idFields: Record<string, MapperItem>;
};

export type MapperItem = {
  oldName: string;
  newName: string;
};

export type ConvertPrismaSchemaForImportObjectsResponse = {
  preparedEntitiesWithFields: CreateBulkEntitiesInput[];
  log: ActionLog[] | null;
};
