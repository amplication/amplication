import { ConcretePrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { CreateBulkEntitiesInput } from "../entity/entity.service";
import { ActionLog } from "../action/dto";
import { ActionContext } from "../UserAction/types";

export type PrepareOperation = (
  prepareOperationIO: PrepareOperationIO
) => PrepareOperationIO;

export type PrepareOperationInput = {
  inputSchema: string;
  existingEntities: ExistingEntitySelect[];
  actionContext: ActionContext;
};

export type PrepareOperationIO = {
  builder: ConcretePrismaSchemaBuilder;
  existingEntities: ExistingEntitySelect[];
  mapper: Mapper;
  actionContext: ActionContext;
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
  log: ActionLog[];
};

export type ExistingEntitySelect = {
  name: string;
};
