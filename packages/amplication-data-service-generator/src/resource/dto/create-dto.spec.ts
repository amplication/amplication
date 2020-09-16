import { builders } from "ast-types";
import { print } from "recast";
import { importNames } from "../../util/ast";
import { Entity, EntityField, EnumDataType } from "../../types";
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
  createDTOFile,
  CLASS_VALIDATOR_MODULE,
  IS_STRING_ID,
  createDTOModule,
  createDTOModules,
} from "./create-dto";

const EXAMPLE_ENTITY_NAME = "ExampleEntityName";
const EXAMPLE_ENTITY_NAME_DIRECTORY = "exampleEntityName";
const EXAMPLE_ENTITY_FIELD_NAME = "exampleEntityFieldName";
const EXAMPLE_ENTITY_FIELD: EntityField = {
  name: EXAMPLE_ENTITY_FIELD_NAME,
  displayName: "Example Entity Field Display Name",
  description: "Example entity field description",
  dataType: EnumDataType.Id,
  required: true,
  searchable: false,
};
const EXAMPLE_ENTITY = {
  name: EXAMPLE_ENTITY_NAME,
  fields: [EXAMPLE_ENTITY_FIELD],
} as Entity;

describe("createDTOModules", () => {
  test("creates modules", () => {
    expect(
      createDTOModules(EXAMPLE_ENTITY, EXAMPLE_ENTITY_NAME_DIRECTORY)
    ).toEqual([
      createDTOModule(
        createCreateInput(EXAMPLE_ENTITY),
        EXAMPLE_ENTITY_NAME_DIRECTORY
      ),
      createDTOModule(
        createUpdateInput(EXAMPLE_ENTITY),
        EXAMPLE_ENTITY_NAME_DIRECTORY
      ),
      createDTOModule(
        createWhereInput(EXAMPLE_ENTITY),
        EXAMPLE_ENTITY_NAME_DIRECTORY
      ),
      createDTOModule(
        createWhereUniqueInput(EXAMPLE_ENTITY),
        EXAMPLE_ENTITY_NAME_DIRECTORY
      ),
    ]);
  });
});

describe("createDTOModule", () => {
  test("creates module", () => {
    const dto = createCreateInput(EXAMPLE_ENTITY);
    expect(createDTOModule(dto, EXAMPLE_ENTITY_NAME_DIRECTORY)).toEqual({
      code: print(createDTOFile(dto)).code,
      path: createDTOModulePath(EXAMPLE_ENTITY_NAME_DIRECTORY, dto.id.name),
    });
  });
});

describe("createDTOFile", () => {
  test("creates file", () => {
    const dto = createCreateInput(EXAMPLE_ENTITY);
    expect(print(createDTOFile(dto)).code).toEqual(
      print(
        builders.file(
          builders.program([
            importNames([IS_STRING_ID], CLASS_VALIDATOR_MODULE),
            builders.exportNamedDeclaration(dto),
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
