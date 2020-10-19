import { builders, namedTypes } from "ast-types";
import { TSTypeKind } from "ast-types/gen/kinds";
import { print } from "recast";
import { classProperty, importNames } from "../../util/ast";
import { relativeImportPath } from "../../util/module";
import {
  Entity,
  EntityField,
  EnumDataType,
  EnumPrivateDataType,
} from "../../types";
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
  createEntityDTO,
  getEntityModuleToDTOIds,
  VALIDATE_NESTED_ID,
  TYPE_ID,
  createFieldValueTypeFromPrismaField,
} from "./create-dto";
import {
  ObjectField,
  ScalarField,
  createScalarField,
  createObjectField,
  ScalarType,
} from "prisma-schema-dsl";

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
const EXAMPLE_OPTIONAL_ENTITY_FIELD: EntityField = {
  name: "exampleOptionalEntityField",
  displayName: "Example Optional Entity Field",
  description: "Example optional entity field description",
  dataType: EnumDataType.Id,
  required: false,
  searchable: false,
};
const EXAMPLE_LIST_ENTITY_FIELD: EntityField = {
  name: "exampleListEntityField",
  displayName: "Example List Entity Field",
  description: "Example list entity field description",
  dataType: EnumPrivateDataType.Roles,
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

describe("createCreateInput", () => {
  const cases: Array<[string, Entity, namedTypes.ClassDeclaration]> = [
    [
      "entity with single ID field",
      EXAMPLE_ENTITY,
      builders.classDeclaration(
        createCreateInputID(EXAMPLE_ENTITY_NAME),
        builders.classBody([
          createFieldClassProperty(
            EXAMPLE_ENTITY_FIELD,
            !EXAMPLE_ENTITY_FIELD.required,
            true,
            EXAMPLE_ENTITY_ID_TO_NAME
          ),
        ])
      ),
    ],
    [
      "entity with single lookup field",
      EXAMPLE_ENTITY_WITH_LOOKUP_FIELD,
      builders.classDeclaration(
        createCreateInputID(EXAMPLE_ENTITY_WITH_LOOKUP_FIELD.name),
        builders.classBody([
          createFieldClassProperty(
            EXAMPLE_ENTITY_LOOKUP_FIELD,
            !EXAMPLE_ENTITY_LOOKUP_FIELD.required,
            true,
            EXAMPLE_ENTITY_ID_TO_NAME
          ),
        ])
      ),
    ],
  ];
  test.each(cases)("creates input for %s", (name, entity, expected) => {
    expect(createCreateInput(entity, EXAMPLE_ENTITY_ID_TO_NAME)).toEqual(
      expected
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
  const cases: Array<[string, Entity, namedTypes.ClassDeclaration]> = [
    [
      "entity with single ID field",
      EXAMPLE_ENTITY,
      builders.classDeclaration(
        createUpdateInputID(EXAMPLE_ENTITY_NAME),
        builders.classBody([
          createFieldClassProperty(
            EXAMPLE_ENTITY_FIELD,
            true,
            true,
            EXAMPLE_ENTITY_ID_TO_NAME
          ),
        ])
      ),
    ],
    [
      "entity with single lookup field",
      EXAMPLE_ENTITY_WITH_LOOKUP_FIELD,
      builders.classDeclaration(
        createUpdateInputID(EXAMPLE_ENTITY_WITH_LOOKUP_FIELD.name),
        builders.classBody([
          createFieldClassProperty(
            EXAMPLE_ENTITY_LOOKUP_FIELD,
            true,
            true,
            EXAMPLE_ENTITY_ID_TO_NAME
          ),
        ])
      ),
    ],
  ];
  test.each(cases)("creates input for %s", (name, entity, expected) => {
    expect(createUpdateInput(entity, EXAMPLE_ENTITY_ID_TO_NAME)).toEqual(
      expected
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
            true,
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
            false,
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
    boolean,
    Record<string, string>,
    namedTypes.ClassProperty
  ]> = [
    [
      "id field (not input)",
      EXAMPLE_ENTITY_FIELD,
      !EXAMPLE_ENTITY_FIELD.required,
      false,
      EXAMPLE_ENTITY_ID_TO_NAME,
      classProperty(
        builders.identifier(EXAMPLE_ENTITY_FIELD.name),
        builders.tsTypeAnnotation(builders.tsStringKeyword()),
        true,
        false,
        null,
        [builders.decorator(builders.callExpression(IS_STRING_ID, []))]
      ),
    ],
    [
      "lookup field (not input)",
      EXAMPLE_ENTITY_LOOKUP_FIELD,
      !EXAMPLE_ENTITY_LOOKUP_FIELD.required,
      false,
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
        null,
        [
          builders.decorator(builders.callExpression(VALIDATE_NESTED_ID, [])),
          builders.decorator(
            builders.callExpression(TYPE_ID, [
              builders.arrowFunctionExpression(
                [],
                builders.identifier(EXAMPLE_OTHER_ENTITY_NAME)
              ),
            ])
          ),
        ]
      ),
    ],
  ];
  test.each(cases)(
    "%s",
    (name, field, optional, entityIdToName, isInput, expected) => {
      expect(
        createFieldClassProperty(field, optional, entityIdToName, isInput)
      ).toEqual(expected);
    }
  );
});

describe("createFieldValueTypeFromPrismaField", () => {
  const cases: Array<[
    string,
    EntityField,
    ScalarField | ObjectField,
    boolean,
    boolean,
    TSTypeKind
  ]> = [
    [
      "scalar type",
      EXAMPLE_ENTITY_FIELD,
      createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        ScalarType.String,
        false,
        true
      ),
      false,
      false,
      builders.tsStringKeyword(),
    ],
    [
      "lookup type, not isInput",
      EXAMPLE_ENTITY_LOOKUP_FIELD,
      createObjectField(
        EXAMPLE_ENTITY_LOOKUP_FIELD.name,
        EXAMPLE_OTHER_ENTITY_NAME,
        false,
        true
      ),
      false,
      false,
      builders.tsTypeReference(builders.identifier(EXAMPLE_ENTITY_NAME)),
    ],
    [
      "lookup type, isInput",
      EXAMPLE_ENTITY_LOOKUP_FIELD,
      createObjectField(
        EXAMPLE_ENTITY_LOOKUP_FIELD.name,
        EXAMPLE_OTHER_ENTITY_NAME,
        false,
        true
      ),
      true,
      false,
      builders.tsTypeReference(createWhereUniqueInputID(EXAMPLE_ENTITY_NAME)),
    ],
    [
      "lookup type, isInput, optional",
      EXAMPLE_ENTITY_LOOKUP_FIELD,
      createObjectField(
        EXAMPLE_ENTITY_FIELD_NAME,
        EXAMPLE_OTHER_ENTITY_NAME,
        false,
        false
      ),
      true,
      false,
      builders.tsTypeReference(createWhereUniqueInputID(EXAMPLE_ENTITY_NAME)),
    ],
    [
      "optional scalar type",
      EXAMPLE_OPTIONAL_ENTITY_FIELD,
      createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        ScalarType.String,
        false,
        false
      ),
      false,
      false,
      builders.tsUnionType([
        builders.tsStringKeyword(),
        builders.tsNullKeyword(),
      ]),
    ],
    [
      "scalar list type",
      EXAMPLE_LIST_ENTITY_FIELD,
      createScalarField(
        EXAMPLE_ENTITY_FIELD_NAME,
        ScalarType.String,
        true,
        true
      ),
      false,
      false,
      builders.tsArrayType(builders.tsStringKeyword()),
    ],
  ];
  test.each(cases)(
    "%s",
    (name, field, prismaField, isInput, isEnum, expected) => {
      expect(
        createFieldValueTypeFromPrismaField(field, prismaField, isInput, isEnum)
      ).toEqual(expected);
    }
  );
});
