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
    /** @todo support create inputs */
    .map(createFieldPropertySignature);
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
    .map(createFieldPropertySignature);
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
  const properties = uniqueFields.map(createFieldPropertySignature);
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
    .map(createFieldPropertySignature);
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
