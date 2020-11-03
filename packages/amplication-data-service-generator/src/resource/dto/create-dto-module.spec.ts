import { builders } from "ast-types";
import { print } from "recast";
import { importNames } from "../../util/ast";
import { relativeImportPath } from "../../util/module";
import { Entity, EntityField, EnumDataType } from "../../types";
import {
  createDTOModulePath,
  createDTOFile,
  createDTOModule,
  getEntityModuleToDTOIds,
} from "./create-dto-module";
import { createWhereUniqueInputID } from "./create-where-unique-input";
import { CLASS_VALIDATOR_MODULE, IS_STRING_ID } from "./class-validator.util";
import { createCreateInput, createCreateInputID } from "./create-create-input";
import { API_PROPERTY_ID, NESTJS_SWAGGER_MODULE } from "./nestjs-swagger.util";

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
const EXAMPLE_OTHER_ENTITY_ID = "EXAMPLE_OTHER_ENTITY_ID";
const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_OTHER_ENTITY_NAME = "ExampleOtherEntityName";
const EXAMPLE_ENTITY_NAME_DIRECTORY = "exampleEntityName";
const EXAMPLE_OTHER_ENTITY_NAME_DIRECTORY = "exampleOtherEntityName";
const EXAMPLE_ENTITY_FIELD_NAME = "exampleEntityFieldName";
const EXAMPLE_ENTITY_FIELD: EntityField = {
  name: EXAMPLE_ENTITY_FIELD_NAME,
  displayName: "Example Entity Field Display Name",
  description: "Example entity field description",
  dataType: EnumDataType.Id,
  required: true,
  searchable: false,
};
const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ENTITY_FIELD],
  permissions: [],
};
const EXAMPLE_OTHER_ENTITY: Entity = {
  id: EXAMPLE_OTHER_ENTITY_ID,
  name: EXAMPLE_OTHER_ENTITY_NAME,
  displayName: "Example Other Entity",
  pluralDisplayName: "Example Other Entities",
  fields: [],
  permissions: [],
};
const EXAMPLE_ENTITY_ID_TO_NAME: Record<string, string> = {
  [EXAMPLE_ENTITY_ID]: EXAMPLE_ENTITY_NAME,
  [EXAMPLE_OTHER_ENTITY_ID]: EXAMPLE_OTHER_ENTITY_NAME,
};
const EXAMPLE_ENTITIES = [EXAMPLE_ENTITY, EXAMPLE_OTHER_ENTITY];

describe("createDTOModule", () => {
  test("creates module", () => {
    const dto = createCreateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME);
    const modulePath = createDTOModulePath(
      EXAMPLE_ENTITY_NAME_DIRECTORY,
      dto.id.name
    );
    expect(
      createDTOModule(dto, EXAMPLE_ENTITY_NAME_DIRECTORY, EXAMPLE_ENTITIES)
    ).toEqual({
      code: print(createDTOFile(dto, modulePath, EXAMPLE_ENTITIES)).code,
      path: modulePath,
    });
  });
});

describe("createDTOFile", () => {
  test("creates file", () => {
    const dto = createCreateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME);
    const modulePath = createDTOModulePath(
      EXAMPLE_ENTITY_NAME_DIRECTORY,
      dto.id.name
    );
    expect(
      print(createDTOFile(dto, modulePath, EXAMPLE_ENTITIES)).code
    ).toEqual(
      print(
        builders.file(
          builders.program([
            importNames([API_PROPERTY_ID], NESTJS_SWAGGER_MODULE),
            importNames([IS_STRING_ID], CLASS_VALIDATOR_MODULE),
            builders.exportNamedDeclaration(dto),
          ])
        )
      ).code
    );
  });
});

describe("getEntityModuleToDTOIds", () => {
  test("gets entity module to DTO ids", () => {
    const exampleEntityDTOModulePath = createDTOModulePath(
      EXAMPLE_ENTITY_NAME_DIRECTORY,
      EXAMPLE_ENTITY_NAME
    );
    const exampleOtherEntityDTOModulePath = createDTOModulePath(
      EXAMPLE_OTHER_ENTITY_NAME_DIRECTORY,
      EXAMPLE_OTHER_ENTITY_NAME
    );
    const exampleOtherEntityWhereUniqueInputId = createWhereUniqueInputID(
      EXAMPLE_OTHER_ENTITY_NAME
    );
    const exampleOtherEntityWhereUniqueInputDTOModulePath = createDTOModulePath(
      EXAMPLE_OTHER_ENTITY_NAME_DIRECTORY,
      exampleOtherEntityWhereUniqueInputId.name
    );
    expect(
      getEntityModuleToDTOIds(exampleEntityDTOModulePath, [
        EXAMPLE_OTHER_ENTITY,
      ])
    ).toEqual({
      [relativeImportPath(
        exampleEntityDTOModulePath,
        exampleOtherEntityDTOModulePath
      )]: [builders.identifier(EXAMPLE_OTHER_ENTITY_NAME)],
      [relativeImportPath(
        exampleEntityDTOModulePath,
        exampleOtherEntityWhereUniqueInputDTOModulePath
      )]: [exampleOtherEntityWhereUniqueInputId],
    });
  });
});

describe("createDTOModulePath", () => {
  test("creates path", () => {
    const dtoName = createCreateInputID(EXAMPLE_ENTITY_NAME).name;
    expect(createDTOModulePath(EXAMPLE_ENTITY_NAME_DIRECTORY, dtoName)).toEqual(
      `${EXAMPLE_ENTITY_NAME_DIRECTORY}/${dtoName}.ts`
    );
  });
});
