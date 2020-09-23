import { builders, namedTypes } from "ast-types";
import { print } from "recast";
import { classProperty, importNames } from "../../util/ast";
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
  createFieldClassProperty,
  createDTOFile,
  CLASS_VALIDATOR_MODULE,
  IS_STRING_ID,
  createDTOModule,
  createDTOModules,
  IS_INSTANCE_ID,
} from "./create-dto";
import { getEntityIdToName } from "util/entity";

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
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
  id: EXAMPLE_ENTITY_ID,
  name: EXAMPLE_ENTITY_NAME,
  fields: [EXAMPLE_ENTITY_FIELD],
} as Entity;
const EXAMPLE_ENTITY_ID_TO_NAME = {
  [EXAMPLE_ENTITY_ID]: EXAMPLE_ENTITY_NAME,
};

describe("createDTOModules", () => {
  test("creates modules", () => {
    expect(
      createDTOModules(
        EXAMPLE_ENTITY,
        EXAMPLE_ENTITY_NAME_DIRECTORY,
        EXAMPLE_ENTITY_ID_TO_NAME
      )
    ).toEqual([
      createDTOModule(
        createCreateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME),
        EXAMPLE_ENTITY_NAME_DIRECTORY
      ),
      createDTOModule(
        createUpdateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME),
        EXAMPLE_ENTITY_NAME_DIRECTORY
      ),
      createDTOModule(
        createWhereInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME),
        EXAMPLE_ENTITY_NAME_DIRECTORY
      ),
      createDTOModule(
        createWhereUniqueInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME),
        EXAMPLE_ENTITY_NAME_DIRECTORY
      ),
    ]);
  });
});

describe("createDTOModule", () => {
  test("creates module", () => {
    const dto = createCreateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME);
    expect(createDTOModule(dto, EXAMPLE_ENTITY_NAME_DIRECTORY)).toEqual({
      code: print(createDTOFile(dto)).code,
      path: createDTOModulePath(EXAMPLE_ENTITY_NAME_DIRECTORY, dto.id.name),
    });
  });
});

describe("createDTOFile", () => {
  test("creates file", () => {
    const dto = createCreateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME);
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
    expect(
      createCreateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME)
    ).toEqual(
      builders.classDeclaration(
        createCreateInputID(EXAMPLE_ENTITY_NAME),
        builders.classBody([
          createFieldClassProperty(
            EXAMPLE_ENTITY_FIELD,
            !EXAMPLE_ENTITY_FIELD.required,
            EXAMPLE_ENTITY_ID_TO_NAME
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
    expect(
      createUpdateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME)
    ).toEqual(
      builders.classDeclaration(
        createUpdateInputID(EXAMPLE_ENTITY_NAME),
        builders.classBody([
          createFieldClassProperty(
            EXAMPLE_ENTITY_FIELD,
            true,
            EXAMPLE_ENTITY_ID_TO_NAME
          ),
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
    expect(
      createWhereUniqueInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME)
    ).toEqual(
      builders.classDeclaration(
        createWhereUniqueInputID(EXAMPLE_ENTITY_NAME),
        builders.classBody([
          createFieldClassProperty(
            EXAMPLE_ENTITY_FIELD,
            false,
            EXAMPLE_ENTITY_ID_TO_NAME
          ),
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
    expect(createWhereInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME)).toEqual(
      builders.classDeclaration(
        createWhereInputID(EXAMPLE_ENTITY_NAME),
        builders.classBody([
          createFieldClassProperty(
            EXAMPLE_ENTITY_FIELD,
            true,
            EXAMPLE_ENTITY_ID_TO_NAME
          ),
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

const EXAMPLE_SINGLE_LINE_TEXT_FIELD: EntityField = {
  dataType: EnumDataType.SingleLineText,
  displayName: "Example Single Line Text Field",
  name: "exampleSingleLineTextField",
  required: true,
  searchable: false,
};

const EMPTY_ENTITY_ID_TO_NAME = {};

const EXAMPLE_LOOKUP_FIELD: EntityField = {
  dataType: EnumDataType.Lookup,
  displayName: "Example Lookup Field",
  name: "exampleLookupField",
  required: true,
  searchable: false,
  properties: {
    relatedEntityId: EXAMPLE_ENTITY_ID,
  },
};

describe("createFieldClassProperty", () => {
  const cases: Array<[
    string,
    EntityField,
    boolean,
    Record<string, string>,
    namedTypes.ClassProperty
  ]> = [
    [
      "single line text field",
      EXAMPLE_SINGLE_LINE_TEXT_FIELD,
      !EXAMPLE_SINGLE_LINE_TEXT_FIELD.required,
      EMPTY_ENTITY_ID_TO_NAME,
      classProperty(
        builders.identifier(EXAMPLE_SINGLE_LINE_TEXT_FIELD.name),
        builders.tsTypeAnnotation(builders.tsStringKeyword()),
        true,
        false,
        [builders.decorator(builders.callExpression(IS_STRING_ID, []))]
      ),
    ],
    [
      "lookup field",
      EXAMPLE_LOOKUP_FIELD,
      !EXAMPLE_LOOKUP_FIELD.required,
      EXAMPLE_ENTITY_ID_TO_NAME,
      classProperty(
        builders.identifier(EXAMPLE_LOOKUP_FIELD.name),
        builders.tsTypeAnnotation(
          builders.tsTypeReference(builders.identifier(EXAMPLE_ENTITY_NAME))
        ),
        true,
        false,
        [
          builders.decorator(
            builders.callExpression(IS_INSTANCE_ID, [
              builders.identifier(EXAMPLE_ENTITY_NAME),
            ])
          ),
        ]
      ),
    ],
  ];
  test.each(cases)("%s", (name, field, optional, entityIdToName, expected) => {
    expect(createFieldClassProperty(field, optional, entityIdToName)).toEqual(
      expected
    );
  });
});
