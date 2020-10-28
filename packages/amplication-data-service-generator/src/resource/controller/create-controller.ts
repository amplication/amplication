import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { Entity, EntityField } from "../../types";
import { Module, readFile, relativeImportPath } from "../../util/module";
import {
  NamedClassDeclaration,
  interpolate,
  removeTSIgnoreComments,
  importNames,
  addImports,
  removeTSVariableDeclares,
  removeTSInterfaceDeclares,
  findClassDeclarationById,
} from "../../util/ast";
import {
  PrismaAction,
  createPrismaArgsID,
} from "../../util/prisma-code-generation";
import { createDTOModulePath } from "../dto/create-dto-module";
import { createDataMapping } from "./create-data-mapping";
import { createSelect } from "./create-select";
import { types } from "amplication-data";
import { createWhereUniqueInputID } from "resource/dto/create-where-unique-input";

const controllerTemplatePath = require.resolve("./controller.template.ts");
const toManyTemplatePath = require.resolve("./to-many.template.ts");

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
  },
  entityDTOs: Record<string, NamedClassDeclaration>
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
    SELECT: createSelect(dtos.entityDTO, entity),
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

  const classDeclaration = findClassDeclarationById(file, controllerId);
  if (!classDeclaration) {
    throw new Error(`Could not find ${controllerId.name}`);
  }

  /** @todo */
  const toManyRelationships: Array<
    EntityField & { properties: types.Lookup }
  > = [];

  for (const field of toManyRelationships) {
    const toManyFile = await readFile(toManyTemplatePath);
    const relationship = field.properties.relatedEntityId;
    interpolate(toManyFile, {
      WHERE_UNIQUE_INPUT: dtos.whereUniqueInput.id,
      RELATIONSHIP_WHERE_UNIQUE_INPUT: createWhereUniqueInputID(relationship),
      RELATIONSHIP_WHERE_INPUT: createWhereUniqueInputID(relationship),
      RELATIONSHIP: builders.identifier(relationship),
      SERVICE: serviceId,
      ENTITY_NAME: dtos.entityDTO.id,
      RELATIONSHIP_NAME: builders.stringLiteral(relationship),
      FIND_MANY_PATH: builders.stringLiteral(`/:id/${field.name}`),
      CREATE_PATH: builders.stringLiteral(`/:id/${field.name}`),
      DELETE_PATH: builders.stringLiteral(`/:id/${field.name}`),
      UPDATE_PATH: builders.stringLiteral(`/:id/${field.name}`),
      /** @todo */
      SELECT: createSelect(relationshipEntityDTO, relationshipEntity),
    });
    const MIXIN_ID = builders.identifier("Mixin");
    const mixinClassDeclaration = findClassDeclarationById(
      toManyFile,
      MIXIN_ID
    );
    if (!mixinClassDeclaration) {
      throw new Error(`Could not find ${MIXIN_ID.name}`);
    }
    classDeclaration.body.body.push(...mixinClassDeclaration.body.body);
  }

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
