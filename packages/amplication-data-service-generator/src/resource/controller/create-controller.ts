import * as path from "path";
import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { Entity } from "../../types";
import { Module, readFile, relativeImportPath } from "../../util/module";
import {
  NamedClassDeclaration,
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
import { createDTOModulePath } from "../dto/create-dto-module";
import { createDataMapping } from "./create-data-mapping";
import { createSelect } from "./create-select";

const controllerTemplatePath = require.resolve("./controller.template.ts");

export async function createControllerModule(
  resource: string,
  entityName: string,
  entityType: string,
  entityServiceModule: string,
  entity: Entity,
  dtos: {
    createInput: NamedClassDeclaration;
    updateInput: NamedClassDeclaration;
    whereInput: NamedClassDeclaration;
    whereUniqueInput: NamedClassDeclaration;
    entityDTO: NamedClassDeclaration;
  }
): Promise<Module> {
  const modulePath = path.join(entityName, `${entityName}.controller.ts`);
  const file = await readFile(controllerTemplatePath);

  const serviceId = builders.identifier(`${entityType}Service`);
  const controllerId = builders.identifier(`${entityType}Controller`);

  interpolate(file, {
    RESOURCE: builders.stringLiteral(resource),
    CONTROLLER: controllerId,
    SERVICE: serviceId,
    ENTITY: dtos.entityDTO.id,
    ENTITY_NAME: builders.stringLiteral(entityType),
    SELECT: createSelect(dtos.entityDTO),
    CREATE_ARGS: createPrismaArgsID(PrismaAction.Create, entityType),
    /** @todo replace */
    CREATE_QUERY: builders.tsTypeLiteral([]),
    UPDATE_QUERY: builders.tsTypeLiteral([]),
    DELETE_QUERY: builders.tsTypeLiteral([]),
    CREATE_INPUT: dtos.createInput.id,
    CREATE_DATA_MAPPING: createDataMapping(entity, dtos.createInput),
    UPDATE_INPUT: dtos.updateInput.id,
    UPDATE_DATA_MAPPING: createDataMapping(entity, dtos.updateInput),
    /** @todo extend */
    WHERE_INPUT: dtos.whereInput.id,
    /** @todo make dynamic */
    FINE_ONE_PATH: builders.stringLiteral("/:id"),
    UPDATE_PATH: builders.stringLiteral("/:id"),
    DELETE_PATH: builders.stringLiteral("/:id"),
    /** @todo replace */
    FIND_ONE_QUERY: builders.tsTypeLiteral([]),
    WHERE_UNIQUE_INPUT: dtos.whereUniqueInput.id,
  });

  const serviceImport = importNames(
    [serviceId],
    relativeImportPath(modulePath, entityServiceModule)
  );

  const dtoImports = Object.values(dtos).map((dto) =>
    importNames(
      [dto.id],
      relativeImportPath(
        modulePath,
        createDTOModulePath(entityName, dto.id.name)
      )
    )
  );

  addImports(file, [serviceImport, ...dtoImports]);
  removeTSIgnoreComments(file);
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);

  return {
    path: modulePath,
    code: print(file).code,
  };
}
