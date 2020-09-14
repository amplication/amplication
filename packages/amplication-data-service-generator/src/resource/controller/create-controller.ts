import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { Module, readFile, relativeImportPath } from "../../util/module";
import {
  interpolate,
  removeTSIgnoreComments,
  importNames,
  addImports,
  removeTSVariableDeclares,
  removeTSInterfaceDeclares,
} from "../../util/ast";
import {
  PrismaAction,
  createPrismaArgsID,
} from "../../util/prisma-code-generation";
import {
  createCreateInputID,
  createDTOModulePath,
  createUpdateInputID,
  createWhereInputID,
  createWhereUniqueInputID,
} from "../dto/create-dto";

const controllerTemplatePath = require.resolve("./controller.template.ts");

export async function createControllerModule(
  resource: string,
  entity: string,
  entityType: string,
  entityServiceModule: string
): Promise<Module> {
  const modulePath = path.join(entity, `${entity}.controller.ts`);
  const file = await readFile(controllerTemplatePath);

  const serviceId = builders.identifier(`${entityType}Service`);
  const controllerId = builders.identifier(`${entityType}Controller`);
  const entityTypeId = builders.identifier(entityType);
  const createInputID = createCreateInputID(entityType);
  const updateInputID = createUpdateInputID(entityType);
  const whereUniqueInputID = createWhereUniqueInputID(entityType);
  const whereInputID = createWhereInputID(entityType);

  interpolate(file, {
    RESOURCE: builders.stringLiteral(resource),
    CONTROLLER: controllerId,
    SERVICE: serviceId,
    ENTITY: entityTypeId,
    ENTITY_NAME: builders.stringLiteral(entityType),
    CREATE_ARGS: createPrismaArgsID(PrismaAction.Create, entityType),
    /** @todo replace */
    CREATE_QUERY: builders.tsTypeLiteral([]),
    UPDATE_QUERY: builders.tsTypeLiteral([]),
    DELETE_QUERY: builders.tsTypeLiteral([]),
    CREATE_INPUT: createInputID,
    UPDATE_INPUT: updateInputID,
    /** @todo extend */
    WHERE_INPUT: whereInputID,
    /** @todo make dynamic */
    FINE_ONE_PATH: builders.stringLiteral("/:id"),
    UPDATE_PATH: builders.stringLiteral("/:id"),
    DELETE_PATH: builders.stringLiteral("/:id"),
    /** @todo replace */
    FIND_ONE_QUERY: builders.tsTypeLiteral([]),
    WHERE_UNIQUE_INPUT: whereUniqueInputID,
  });

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );
  const createInputImport = importNames(
    [createInputID],
    relativeImportPath(
      modulePath,
      createDTOModulePath(entityType, createInputID.name)
    )
  );
  const updateInputImport = importNames(
    [updateInputID],
    relativeImportPath(
      modulePath,
      createDTOModulePath(entityType, updateInputID.name)
    )
  );
  const whereUniqueInputImport = importNames(
    [whereUniqueInputID],
    relativeImportPath(
      modulePath,
      createDTOModulePath(entityType, whereUniqueInputID.name)
    )
  );
  const whereInputImport = importNames(
    [whereInputID],
    relativeImportPath(
      modulePath,
      createDTOModulePath(entityType, whereInputID.name)
    )
  );

  addImports(file, [
    serviceImport,
    createInputImport,
    updateInputImport,
    whereUniqueInputImport,
    whereInputImport,
  ]);
  removeTSIgnoreComments(file);
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);

  return {
    path: modulePath,
    code: print(file).code,
  };
}
