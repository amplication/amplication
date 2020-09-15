import { print } from "recast";
import { namedTypes, builders } from "ast-types";
import { TSTypeKind } from "ast-types/gen/kinds";
import { FieldKind, ScalarType } from "prisma-schema-dsl";
import { FullEntity, FullEntityField, EnumDataType } from "../../types";
import { Module } from "../../util/module";
import { createPrismaField } from "../../prisma/create-prisma-schema";
import {
  addImports,
  findContainedIdentifiers,
  importNames,
  tsPropertySignature,
} from "../../util/ast";

type NamedClassDeclaration = namedTypes.ClassDeclaration & {
  id: namedTypes.Identifier;
};

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
export const IS_BOOLEAN = builders.identifier("IsBoolean");
export const IS_DATE = builders.identifier("IsDate");
export const IS_NUMBER_ID = builders.identifier("IsNumber");
export const IS_INT_ID = builders.identifier("IsInt");
export const IS_STRING_ID = builders.identifier("IsString");
export const IS_OPTIONAL_ID = builders.identifier("IsOptional");
const CLASS_VALIDATOR_IDS = [
  IS_BOOLEAN,
  IS_DATE,
  IS_NUMBER_ID,
  IS_INT_ID,
  IS_STRING_ID,
  IS_OPTIONAL_ID,
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
export const CLASS_VALIDATOR_MODULE = "class-validator";

export function createDTOModules(
  entity: FullEntity,
  entityName: string
): Module[] {
  const dtos = [
    createCreateInput(entity),
    createUpdateInput(entity),
    createWhereInput(entity),
    createWhereUniqueInput(entity),
  ];
  return dtos.map((dto) => createDTOModule(dto, entityName));
}

export function createDTOModule(
  dto: NamedClassDeclaration,
  entityName: string
): Module {
  return {
    code: print(createDTOFile(dto)).code,
    path: createDTOModulePath(entityName, dto.id.name),
  };
}

export function createDTOFile(
  dto: namedTypes.ClassDeclaration
): namedTypes.File {
  const file = builders.file(
    builders.program([builders.exportNamedDeclaration(dto)])
  );

  addClassValidatorImports(file);

  return file;
}

function addClassValidatorImports(file: namedTypes.File): void {
  const classValidatorIds = findContainedIdentifiers(file, CLASS_VALIDATOR_IDS);
  addImports(file, [importNames(classValidatorIds, CLASS_VALIDATOR_MODULE)]);
}

export function createDTOModulePath(
  entityName: string,
  dtoName: string
): string {
  return `${entityName}/${dtoName}.ts`;
}

export function createCreateInput(entity: FullEntity): NamedClassDeclaration {
  const properties = entity.fields
    .filter(isEditableField)
    /** @todo support create inputs */
    .map((field) => createFieldPropertySignature(field, !field.required));
  return builders.classDeclaration(
    createCreateInputID(entity.name),
    builders.classBody(properties)
  ) as NamedClassDeclaration;
}

export function createCreateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}CreateInput`);
}

export function createUpdateInput(entity: FullEntity): NamedClassDeclaration {
  const properties = entity.fields
    .filter(isEditableField)
    /** @todo support create inputs */
    .map((field) => createFieldPropertySignature(field, true));
  return builders.classDeclaration(
    createUpdateInputID(entity.name),
    builders.classBody(properties)
  ) as NamedClassDeclaration;
}

export function createUpdateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}UpdateInput`);
}

export function createWhereUniqueInput(
  entity: FullEntity
): NamedClassDeclaration {
  const uniqueFields = entity.fields.filter(isUniqueField);
  const properties = uniqueFields.map((field) =>
    createFieldPropertySignature(field, false)
  );
  return builders.classDeclaration(
    createWhereUniqueInputID(entity.name),
    builders.classBody(properties)
  ) as NamedClassDeclaration;
}

export function createWhereUniqueInputID(
  entityName: string
): namedTypes.Identifier {
  return builders.identifier(`${entityName}WhereUniqueInput`);
}

export function createWhereInput(entity: FullEntity): NamedClassDeclaration {
  const properties = entity.fields
    .filter((field) => field.name)
    /** @todo support filters */
    .map((field) => createFieldPropertySignature(field, true));
  return builders.classDeclaration(
    createWhereInputID(entity.name),
    builders.classBody(properties)
  ) as NamedClassDeclaration;
}

export function createWhereInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}WhereInput`);
}

function isUniqueField(field: FullEntityField): boolean {
  return field.dataType === EnumDataType.Id;
}

function isEditableField(field: FullEntityField): boolean {
  return !UNEDITABLE_FIELDS.has(field.name);
}

export function createFieldPropertySignature(
  field: FullEntityField,
  optional: boolean
): namedTypes.TSPropertySignature {
  const prismaField = createPrismaField(field);
  const type =
    prismaField.kind === FieldKind.Scalar
      ? PRISMA_SCALAR_TO_TYPE[prismaField.type]
      : /** @todo add import */
        builders.tsTypeReference(builders.identifier(prismaField.type));
  let decorators =
    prismaField.kind === FieldKind.Scalar
      ? PRISMA_SCALAR_TO_DECORATORS[prismaField.type]
      : [];
  if (optional) {
    decorators = [
      ...decorators,
      builders.decorator(builders.callExpression(IS_OPTIONAL_ID, [])),
    ];
  }
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
