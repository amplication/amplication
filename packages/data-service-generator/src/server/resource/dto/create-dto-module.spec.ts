import { builders } from "ast-types";
import { print } from "@amplication/code-gen-utils";
import {
  addAutoGenerationComment,
  exportNames,
  importNames,
} from "../../../utils/ast";
import { Entity } from "@amplication/code-gen-types";
import {
  EXAMPLE_ID_FIELD,
  EXAMPLE_SINGLE_LINE_TEXT_FIELD,
  EXAMPLE_OTHER_ENTITY,
} from "../util/test-data";
import {
  createDTOModulePath,
  createDTOFile,
  createDTOModule,
} from "./create-dto-module";
import { CLASS_VALIDATOR_MODULE, IS_STRING_ID } from "./class-validator.util";
import { createCreateInputID } from "./create-create-input";
import { API_PROPERTY_ID, NESTJS_SWAGGER_MODULE } from "./nestjs-swagger.util";
import { SERVER_BASE_DIRECTORY, SRC_DIRECTORY } from "../../constants";
import {
  FIELD_ID,
  INPUT_TYPE_ID,
  NESTJS_GRAPHQL_MODULE,
} from "./nestjs-graphql.util";
import DsgContext from "../../../dsg-context";
import { createEntityInputFiles } from "../create-dtos";

const context = DsgContext.getInstance;
context.serverDirectories = {
  srcDirectory: `${SERVER_BASE_DIRECTORY}/src`,
  scriptsDirectory: "exampleScriptsDirectory",
  baseDirectory: "exampleBaseDirectory",
  authDirectory: "exampleAuthDirectory",
  messageBrokerDirectory: "ExampleMessageBrokerDirectory",
};

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_ENTITY_NAME_DIRECTORY = "exampleEntityName";
const EXAMPLE_OTHER_ENTITY_NAME_DIRECTORY = "exampleOtherEntityName";
const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: "Example Entity",
  pluralName: "ExampleEntities",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ID_FIELD, EXAMPLE_SINGLE_LINE_TEXT_FIELD],
  permissions: [],
};
const EXAMPLE_ENTITY_CREATE_INPUT_DTO_NAME =
  createCreateInputID(EXAMPLE_ENTITY_NAME).name;
const EXAMPLE_DTO_NAME_TO_PATH = {
  [EXAMPLE_ENTITY_CREATE_INPUT_DTO_NAME]: createDTOModulePath(
    EXAMPLE_ENTITY_NAME_DIRECTORY,
    EXAMPLE_ENTITY_CREATE_INPUT_DTO_NAME
  ),
  [EXAMPLE_OTHER_ENTITY.name]: createDTOModulePath(
    EXAMPLE_OTHER_ENTITY_NAME_DIRECTORY,
    EXAMPLE_OTHER_ENTITY.name
  ),
};

describe("createDTOModule", () => {
  test("creates module", () => {
    const dto = createEntityInputFiles(EXAMPLE_ENTITY).createInput;
    const modulePath = createDTOModulePath(
      EXAMPLE_ENTITY_NAME_DIRECTORY,
      dto.id.name
    );
    const file = createDTOFile(dto, modulePath, EXAMPLE_DTO_NAME_TO_PATH);
    addAutoGenerationComment(file);
    expect(createDTOModule(dto, EXAMPLE_DTO_NAME_TO_PATH)).toEqual({
      code: print(file).code,
      path: modulePath,
    });
  });
});

describe("createDTOFile", () => {
  test("creates file", () => {
    const dto = createEntityInputFiles(EXAMPLE_ENTITY).createInput;
    const modulePath = createDTOModulePath(
      EXAMPLE_ENTITY_NAME_DIRECTORY,
      dto.id.name
    );
    expect(
      print(createDTOFile(dto, modulePath, EXAMPLE_DTO_NAME_TO_PATH)).code
    ).toEqual(
      print(
        builders.file(
          builders.program([
            importNames([INPUT_TYPE_ID, FIELD_ID], NESTJS_GRAPHQL_MODULE),
            importNames([API_PROPERTY_ID], NESTJS_SWAGGER_MODULE),
            importNames([IS_STRING_ID], CLASS_VALIDATOR_MODULE),
            dto,
            exportNames([dto.id]),
          ])
        )
      ).code
    );
  });
});

describe("createDTOModulePath", () => {
  test("creates path", () => {
    const dtoName = createCreateInputID(EXAMPLE_ENTITY_NAME).name;
    expect(createDTOModulePath(EXAMPLE_ENTITY_NAME_DIRECTORY, dtoName)).toEqual(
      `${SRC_DIRECTORY}/${EXAMPLE_ENTITY_NAME_DIRECTORY}/base/${dtoName}.ts`
    );
  });
});
