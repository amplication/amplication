import { print } from "recast";
import { namedTypes, builders } from "ast-types";
import { TSTypeKind } from "ast-types/gen/kinds";
import { FullEntity } from "../../types";
import { EntityField, EnumDataType } from "../../models";
import { Module } from "../../util/module";
import { createPrismaField } from "../../prisma/create-prisma-schema";
import { FieldKind, ScalarType } from "prisma-schema-dsl";
import {
  addImports,
  findContainedIdentifiers,
  importNames,
  tsPropertySignature,
} from "../../util/ast";

const UNEDITABLE_FIELDS = new Set<string>(["id", "createdAt", "updatedAt"]);

const PRISMA_SCALAR_TO_TYPE: {
  [scalar in ScalarType]: TSTypeKind;
} = {
  [ScalarType.Boolean]: builders.tsBooleanKeyword(),
  [ScalarType.DateTime]: builders.tsTypeReference(builders.identifier("Date")),
  [ScalarType.Float]: builders.tsNumberKeyword(),
  [ScalarType.Int]: builders.tsNumberKeyword(),
  [ScalarType.String]: builders.tsStringKeyword(),
  [ScalarType.Json]: builders.tsUnknownKeyword(),
};
const IS_BOOLEAN = builders.identifier("IsBoolean");
const IS_DATE = builders.identifier("IsDate");
const IS_NUMBER_ID = builders.identifier("IsNumber");
const IS_INT_ID = builders.identifier("IsInt");
const IS_STRING_ID = builders.identifier("IsString");
const CLASS_VALIDATOR_IDS = [
  IS_BOOLEAN,
  IS_DATE,
  IS_NUMBER_ID,
  IS_INT_ID,
  IS_STRING_ID,
];
const PRISMA_SCALAR_TO_DECORATORS: {
  [scalar in ScalarType]: namedTypes.Decorator[];
} = {
  [ScalarType.Boolean]: [
    builders.decorator(builders.callExpression(IS_BOOLEAN, [])),
  ],
  [ScalarType.DateTime]: [
    builders.decorator(builders.callExpression(IS_DATE, [])),
  ],
  [ScalarType.Float]: [
    builders.decorator(builders.callExpression(IS_NUMBER_ID, [])),
  ],
  [ScalarType.Int]: [
    builders.decorator(builders.callExpression(IS_INT_ID, [])),
  ],
  [ScalarType.String]: [
    builders.decorator(builders.callExpression(IS_STRING_ID, [])),
  ],
  [ScalarType.Json]: [],
};
const CLASS_VALIDATOR_MODULE = "class-validator";

export function createDTOModules(entity: FullEntity): Module[] {
  const dtos = [
    createCreateInput(entity),
    createUpdateInput(entity),
    createWhereInput(entity),
    createWhereUniqueInput(entity),
  ];
  return dtos.map((dto) => {
    const program = builders.file(
      builders.program([builders.exportNamedDeclaration(dto)])
    );
    const classValidatorIds = findContainedIdentifiers(
      dto,
      CLASS_VALIDATOR_IDS
    );
    addImports(program, [
      importNames(classValidatorIds, CLASS_VALIDATOR_MODULE),
    ]);
    if (!dto.id) {
      throw new Error("DTO must have an ID");
    }
    return {
      code: print(program).code,
      /** @todo lower case entity directory */
      path: createDTOModulePath(entity.name, dto.id.name),
    };
  });
}

export function createDTOModulePath(
  entityName: string,
  dtoName: string
): string {
  return `${entityName}/${dtoName}.ts`;
}

export function createCreateInput(
  entity: FullEntity
): namedTypes.ClassDeclaration {
  const properties = entity.fields
    .filter(isEditableField)
    /** @todo support create inputs */
    .map((field) => createFieldPropertySignature(field, false));
  return builders.classDeclaration(
    createCreateInputID(entity.name),
    builders.classBody(properties)
  );
}

export function createCreateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}CreateInput`);
}

export function createUpdateInput(
  entity: FullEntity
): namedTypes.ClassDeclaration {
  const properties = entity.fields
    .filter(isEditableField)
    /** @todo support create inputs */
    .map((field) => createFieldPropertySignature(field, true));
  return builders.classDeclaration(
    createUpdateInputID(entity.name),
    builders.classBody(properties)
  );
}

export function createUpdateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}UpdateInput`);
}

export function createWhereUniqueInput(
  entity: FullEntity
): namedTypes.ClassDeclaration {
  const uniqueFields = entity.fields.filter(isUniqueField);
  const properties = uniqueFields.map((field) =>
    createFieldPropertySignature(field, true)
  );
  return builders.classDeclaration(
    createWhereUniqueInputID(entity.name),
    builders.classBody(properties)
  );
}

export function createWhereUniqueInputID(
  entityName: string
): namedTypes.Identifier {
  return builders.identifier(`${entityName}WhereUniqueInput`);
}

export function createWhereInput(
  entity: FullEntity
): namedTypes.ClassDeclaration {
  const properties = entity.fields
    .filter((field) => field.name)
    /** @todo support filters */
    .map((field) => createFieldPropertySignature(field, false));
  return builders.classDeclaration(
    createWhereInputID(entity.name),
    builders.classBody(properties)
  );
}

export function createWhereInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}WhereInput`);
}

function isUniqueField(field: EntityField): boolean {
  return field.dataType === EnumDataType.Id;
}

function isEditableField(field: EntityField): boolean {
  return !UNEDITABLE_FIELDS.has(field.name);
}

function createFieldPropertySignature(
  field: EntityField,
  optional: boolean
): namedTypes.TSPropertySignature {
  const prismaField = createPrismaField(field);
  const type =
    prismaField.kind === FieldKind.Scalar
      ? PRISMA_SCALAR_TO_TYPE[prismaField.type]
      : /** @todo add import */
        builders.tsTypeReference(builders.identifier(prismaField.type));
  const decorators =
    prismaField.kind === FieldKind.Scalar
      ? PRISMA_SCALAR_TO_DECORATORS[prismaField.type]
      : [];
  const id = builders.identifier(field.name);
  const typeAnnotation = builders.tsTypeAnnotation(type);
  return tsPropertySignature(
    id,
    typeAnnotation,
    !optional,
    optional,
    decorators
  );
}
