import { ConcretePrismaSchemaBuilder } from "@mrleebo/prisma-ast";
import { CreateBulkEntitiesInput } from "../entity/entity.service";
import { ActionLog } from "../action/dto";
import { ActionContext } from "../userAction/types";

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

type OriginalModelName = string;
type OriginalFieldName = string;
type NewModelName = string;
type NewFieldName = string;

export type Mapper = {
  modelNames: Record<OriginalModelName, MapperItem>;
  fieldNames: Record<NewModelName, Record<OriginalFieldName, MapperItem>>;
  fieldTypes: Record<
    NewModelName,
    Record<NewFieldName, Record<string, MapperItem>>
  >;
  idFields: Record<NewModelName, Record<NewFieldName, MapperItem>>;
};

export type MapperItem = {
  originalName: string;
  newName: string;
};

export type ConvertPrismaSchemaForImportObjectsResponse = {
  preparedEntitiesWithFields: CreateBulkEntitiesInput[];
  log: ActionLog[];
};

export type ExistingEntitySelect = {
  name: string;
};
