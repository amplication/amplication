import { builders, namedTypes } from "ast-types";
import { TSTypeKind } from "ast-types/gen/kinds";
import { ObjectField, ScalarField } from "prisma-schema-dsl";
import { Entity, EntityField } from "../../../../types";
import {
  classDeclaration,
  classProperty,
  NamedClassDeclaration,
} from "../../../../util/ast";
import { createPrismaFields } from "../../../prisma/create-prisma-schema";
import { ApiPropertyDecoratorBuilder } from "../api-property-decorator";
import {
  createFieldValueTypeFromPrismaField,
  getTypeName,
} from "../create-field-class-property";
import { EntityDtoTypeEnum } from "../entity-dto-type-enum";
import { createGraphQLFieldDecorator } from "../graphql-field-decorator";
import { INPUT_TYPE_DECORATOR } from "../nestjs-graphql.util";

export enum NestedMutationOptions {
  "Create" = "create",
  "Connect" = "connect",
  "ConnectOrCreate" = "connectOrCreate",
}

export function createNestedInputDTO(
  classId: namedTypes.Identifier,
  entity: Entity,
  toManyField: EntityField,
  dtoType: EntityDtoTypeEnum
): NamedClassDeclaration {
  const properties = createNestedManyProperties(toManyField, entity, dtoType);
  const decorators = properties.length ? [INPUT_TYPE_DECORATOR] : [];
  return classDeclaration(
    classId,
    builders.classBody(properties),
    null,
    decorators
  ) as NamedClassDeclaration;
}

function createNestedManyProperties(
  field: EntityField,
  entity: Entity,
  dtoType: EntityDtoTypeEnum
): namedTypes.ClassProperty[] {
  const [prismaField] = createPrismaFields(field, entity);
  const [type, arrayType] = createFieldValueTypeFromPrismaField(
    entity.pluralDisplayName,
    field,
    prismaField,
    false,
    false,
    false,
    false,
    true,
    dtoType
  );
  return [
    createNestedManyProperty(
      NestedMutationOptions.Connect,
      type,
      prismaField,
      field,
      entity,
      arrayType,
      dtoType
    ),
    //TODO disconnect
    // createNestedManyProperty(NestedMutationOptions.Create, type),
    // createNestedManyProperty(NestedMutationOptions.ConnectOrCreate, type),
  ];
}

function createNestedManyProperty(
  propertyName: string,
  propertyValueType: TSTypeKind,
  prismaField: ScalarField | ObjectField,
  field: EntityField,
  entity: Entity,
  arrayType: TSTypeKind,
  dtoType: EntityDtoTypeEnum
): namedTypes.ClassProperty {
  const propertyKey = builders.identifier(propertyName);
  const propertyType = builders.tsTypeAnnotation(propertyValueType);
  const decorators: namedTypes.Decorator[] = [];

  decorators.push(
    createGraphQLFieldDecorator(
      prismaField,
      false,
      field,
      true,
      entity,
      false,
      dtoType,
      true
    )
  );
  const typeName = getTypeName(
    propertyValueType,
    arrayType,
    prismaField.isList
  );

  decorators.push(
    new ApiPropertyDecoratorBuilder(true, false)
      .optional(true)
      .objectType(typeName)
      .build()
  );

  return classProperty(
    propertyKey,
    propertyType,
    false,
    true,
    null,
    decorators
  );
}
