import { builders, namedTypes } from "ast-types";
import { print } from "recast";
import {
  classProperty,
  importNames,
  findContainedIdentifiers,
} from "../../util/ast";
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
  createEntityDTO,
  getEntityDTOImports,
  getClassValidatorImports,
} from "./create-dto";

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
const EXAMPLE_ENTITY_LOOKUP_FIELD: EntityField = {
  dataType: EnumDataType.Lookup,
  displayName: "Example Lookup Field",
  name: "exampleLookupField",
  required: true,
  searchable: false,
  properties: {
    relatedEntityId: EXAMPLE_OTHER_ENTITY_ID,
  },
};
const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  name: EXAMPLE_ENTITY_NAME,
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [EXAMPLE_ENTITY_FIELD],
  permissions: [],
};
const EXAMPLE_ENTITY_WITH_LOOKUP_FIELD: Entity = {
  id: "EXAMPLE_ENTITY_WITH_LOOKUP_FIELD_ID",
  name: "ExampleEntityWithLookupField",
  displayName: "Example Entity With Lookup Field",
  pluralDisplayName: "Example Entities With Lookup Field",
  fields: [EXAMPLE_ENTITY_LOOKUP_FIELD],
  permissions: [],
};
const EXAMPLE_ENTITY_ID_TO_NAME: Record<string, string> = {
  [EXAMPLE_ENTITY_ID]: EXAMPLE_ENTITY_NAME,
  [EXAMPLE_OTHER_ENTITY_ID]: EXAMPLE_OTHER_ENTITY_NAME,
};
const EXAMPLE_ENTITY_NAMES: string[] = Object.values(EXAMPLE_ENTITY_ID_TO_NAME);

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
        EXAMPLE_ENTITY_NAME_DIRECTORY,
        EXAMPLE_ENTITY_NAMES
      ),
      createDTOModule(
        createUpdateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME),
        EXAMPLE_ENTITY_NAME_DIRECTORY,
        EXAMPLE_ENTITY_NAMES
      ),
      createDTOModule(
        createWhereInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME),
        EXAMPLE_ENTITY_NAME_DIRECTORY,
        EXAMPLE_ENTITY_NAMES
      ),
      createDTOModule(
        createWhereUniqueInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME),
        EXAMPLE_ENTITY_NAME_DIRECTORY,
        EXAMPLE_ENTITY_NAMES
      ),
      createDTOModule(
        createEntityDTO(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME),
        EXAMPLE_ENTITY_NAME_DIRECTORY,
        EXAMPLE_ENTITY_NAMES
      ),
    ]);
  });
});

describe("createDTOModule", () => {
  test("creates module", () => {
    const dto = createCreateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME);
    expect(
      createDTOModule(dto, EXAMPLE_ENTITY_NAME_DIRECTORY, EXAMPLE_ENTITY_NAMES)
    ).toEqual({
      code: print(createDTOFile(dto, EXAMPLE_ENTITY_NAMES)).code,
      path: createDTOModulePath(EXAMPLE_ENTITY_NAME_DIRECTORY, dto.id.name),
    });
  });
});

describe("createDTOFile", () => {
  test("creates file", () => {
    const dto = createCreateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME);
    expect(print(createDTOFile(dto, EXAMPLE_ENTITY_NAMES)).code).toEqual(
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

describe("getEntityDTOImports", () => {
  test("gets entity DTO imports", () => {
    const dto = createCreateInput(
      EXAMPLE_ENTITY_WITH_LOOKUP_FIELD,
      EXAMPLE_ENTITY_ID_TO_NAME
    );
    expect(getEntityDTOImports(dto, EXAMPLE_ENTITY_NAMES)).toEqual([
      importNames(
        findContainedIdentifiers(dto, [
          builders.identifier(EXAMPLE_OTHER_ENTITY_NAME),
        ]).slice(1),
        createDTOModulePath(
          EXAMPLE_OTHER_ENTITY_NAME_DIRECTORY,
          EXAMPLE_OTHER_ENTITY_NAME
        )
      ),
    ]);
  });
});

describe("getClassValidatorImports", () => {
  test("gets class validator imports", () => {
    const dto = createCreateInput(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME);
    expect(getClassValidatorImports(dto)).toEqual(
      importNames(
        findContainedIdentifiers(dto, [IS_STRING_ID]),
        CLASS_VALIDATOR_MODULE
      )
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

describe("createEntityDTO", () => {
  test("creates entity DTO", () => {
    expect(createEntityDTO(EXAMPLE_ENTITY, EXAMPLE_ENTITY_ID_TO_NAME)).toEqual(
      builders.classDeclaration(
        builders.identifier(EXAMPLE_ENTITY_NAME),
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

describe("createFieldClassProperty", () => {
  const cases: Array<[
    string,
    EntityField,
    boolean,
    Record<string, string>,
    namedTypes.ClassProperty
  ]> = [
    [
      "id field",
      EXAMPLE_ENTITY_FIELD,
      !EXAMPLE_ENTITY_FIELD.required,
      EXAMPLE_ENTITY_ID_TO_NAME,
      classProperty(
        builders.identifier(EXAMPLE_ENTITY_FIELD.name),
        builders.tsTypeAnnotation(builders.tsStringKeyword()),
        true,
        false,
        [builders.decorator(builders.callExpression(IS_STRING_ID, []))]
      ),
    ],
    [
      "lookup field",
      EXAMPLE_ENTITY_LOOKUP_FIELD,
      !EXAMPLE_ENTITY_LOOKUP_FIELD.required,
      EXAMPLE_ENTITY_ID_TO_NAME,
      classProperty(
        builders.identifier(EXAMPLE_ENTITY_LOOKUP_FIELD.name),
        builders.tsTypeAnnotation(
          builders.tsTypeReference(
            builders.identifier(EXAMPLE_OTHER_ENTITY_NAME)
          )
        ),
        true,
        false,
        [
          builders.decorator(
            builders.callExpression(IS_INSTANCE_ID, [
              builders.identifier(EXAMPLE_OTHER_ENTITY_NAME),
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
