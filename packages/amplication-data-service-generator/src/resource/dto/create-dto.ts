import { print } from "recast";
import { namedTypes, builders } from "ast-types";
import { TSTypeKind } from "ast-types/gen/kinds";
import { FullEntity } from "../../types";
import { EntityField, EnumDataType } from "../../models";
import { Module } from "../../util/module";
import { createPrismaField } from "../../prisma/create-prisma-schema";
import { FieldKind, ScalarType } from "prisma-schema-dsl";

export function createDTOModules(entity: FullEntity): Module[] {
  const dtos = [
    createCreateInput(entity),
    createUpdateInput(entity),
    createWhereInput(entity),
    createWhereUniqueInput(entity),
  ];
  return dtos.map((dto) => {
    const program = builders.program([builders.exportNamedDeclaration(dto)]);
    return {
      code: print(program).code,
      /** @todo lower case entity directory */
      path: `${entity.name}/${dto.id?.name}.ts`,
    };
  });
}

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

export function createCreateInput(
  entity: FullEntity
): namedTypes.ClassDeclaration {
  const properties = entity.fields
    .filter(isEditableField)
    .map(createFieldPropertySignature);
  return builders.classDeclaration(
    builders.identifier(`${entity.name}CreateInput`),
    builders.classBody(properties)
  );
}

export function createUpdateInput(
  entity: FullEntity
): namedTypes.ClassDeclaration {
  const properties = entity.fields
    .filter(isEditableField)
    .map(createFieldPropertySignature);
  return builders.classDeclaration(
    builders.identifier(`${entity.name}UpdateInput`),
    builders.classBody(properties)
  );
}

export function createWhereUniqueInput(
  entity: FullEntity
): namedTypes.ClassDeclaration {
  const uniqueFields = entity.fields.filter(isUniqueField);
  const properties = uniqueFields.map(createFieldPropertySignature);
  return builders.classDeclaration(
    builders.identifier(`${entity.name}WhereUniqueInput`),
    builders.classBody(properties)
  );
}

function isUniqueField(field: EntityField): boolean {
  return field.dataType === EnumDataType.Id;
}

function isEditableField(field: EntityField): boolean {
  return !UNEDITABLE_FIELDS.has(field.name);
}

function createFieldPropertySignature(
  field: EntityField
): namedTypes.TSPropertySignature {
  const prismaField = createPrismaField(field);
  const type =
    prismaField.kind === FieldKind.Scalar
      ? PRISMA_SCALAR_TO_TYPE[prismaField.type]
      : /** @todo add import */
        builders.tsTypeReference(builders.identifier(prismaField.type));
  return builders.tsPropertySignature(
    builders.identifier(field.name),
    builders.tsTypeAnnotation(type)
  );
}

export function createWhereInput(
  entity: FullEntity
): namedTypes.ClassDeclaration {
  const properties = entity.fields
    .filter((field) => field.name)
    .map((field) => {
      /** @todo */
      const type = builders.tsNullKeyword();
      return builders.tsPropertySignature(
        builders.identifier(field.name),
        builders.tsTypeAnnotation(type)
      );
    });
  return builders.classDeclaration(
    builders.identifier(`${entity.name}WhereInput`),
    builders.classBody(properties)
  );
}
