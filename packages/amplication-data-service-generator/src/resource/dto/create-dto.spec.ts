import { builders } from "ast-types";
import * as models from "../../models";
import { FullEntity } from "../../types";
import {
  createDTOModulePath,
  createCreateInput,
  createCreateInputID,
  createUpdateInput,
  createUpdateInputID,
  createWhereUniqueInput,
  createWhereUniqueInputID,
  createWhereInput,
  createWhereInputID,
  createFieldPropertySignature,
} from "./create-dto";

const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_ENTITY_NAME_DIRECTORY = "exampleEntityName";
const EXAMPLE_ENTITY_FIELD_NAME = "exampleEntityFieldName";
const EXAMPLE_ENTITY_FIELD = {
  name: EXAMPLE_ENTITY_FIELD_NAME,
  dataType: models.EnumDataType.Id,
  required: true,
} as models.EntityField;
const EXAMPLE_ENTITY = {
  name: EXAMPLE_ENTITY_NAME,
  fields: [EXAMPLE_ENTITY_FIELD],
} as FullEntity;

describe("createDTOModulePath", () => {
  test("creates path", () => {
    const dtoName = createCreateInputID(EXAMPLE_ENTITY_NAME).name;
    expect(createDTOModulePath(EXAMPLE_ENTITY_NAME_DIRECTORY, dtoName)).toEqual(
      `${EXAMPLE_ENTITY_NAME_DIRECTORY}/${dtoName}.ts`
    );
  });
});
describe("createCreateInput", () => {
  test("creates input", () => {
    expect(createCreateInput(EXAMPLE_ENTITY)).toEqual(
      builders.classDeclaration(
        createCreateInputID(EXAMPLE_ENTITY_NAME),
        builders.classBody([
          createFieldPropertySignature(
            EXAMPLE_ENTITY_FIELD,
            !EXAMPLE_ENTITY_FIELD.required
          ),
        ])
      )
    );
  });
});
describe("createCreateInputID", () => {
  test("creates identifier", () => {
    expect(createCreateInputID(EXAMPLE_ENTITY_NAME)).toEqual(
      builders.identifier(`${EXAMPLE_ENTITY_NAME}CreateInput`)
    );
  });
});
describe("createUpdateInput", () => {
  test("creates input", () => {
    expect(createUpdateInput(EXAMPLE_ENTITY)).toEqual(
      builders.classDeclaration(
        createUpdateInputID(EXAMPLE_ENTITY_NAME),
        builders.classBody([
          createFieldPropertySignature(EXAMPLE_ENTITY_FIELD, true),
        ])
      )
    );
  });
});
describe("createUpdateInputID", () => {
  test("creates identifier", () => {
    expect(createUpdateInputID(EXAMPLE_ENTITY_NAME)).toEqual(
      builders.identifier(`${EXAMPLE_ENTITY_NAME}UpdateInput`)
    );
  });
});
describe("createWhereUniqueInput", () => {
  test("creates input", () => {
    expect(createWhereUniqueInput(EXAMPLE_ENTITY)).toEqual(
      builders.classDeclaration(
        createWhereUniqueInputID(EXAMPLE_ENTITY_NAME),
        builders.classBody([
          createFieldPropertySignature(EXAMPLE_ENTITY_FIELD, false),
        ])
      )
    );
  });
});
describe("createWhereUniqueInputID", () => {
  test("creates identifier", () => {
    expect(createWhereUniqueInputID(EXAMPLE_ENTITY_NAME)).toEqual(
      builders.identifier(`${EXAMPLE_ENTITY_NAME}WhereUniqueInput`)
    );
  });
});
describe("createWhereInput", () => {
  test("creates input", () => {
    expect(createWhereInput(EXAMPLE_ENTITY)).toEqual(
      builders.classDeclaration(
        createWhereInputID(EXAMPLE_ENTITY_NAME),
        builders.classBody([
          createFieldPropertySignature(EXAMPLE_ENTITY_FIELD, true),
        ])
      )
    );
  });
});
describe("createWhereInputID", () => {
  test("creates identifier", () => {
    expect(createWhereInputID(EXAMPLE_ENTITY_NAME)).toEqual(
      builders.identifier(`${EXAMPLE_ENTITY_NAME}WhereInput`)
    );
  });
});
