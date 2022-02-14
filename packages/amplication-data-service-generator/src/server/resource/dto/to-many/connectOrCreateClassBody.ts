import { builders, namedTypes } from "ast-types";
import { TSTypeKind } from "ast-types/gen/kinds";
import { ObjectField, ScalarField } from "prisma-schema-dsl";
import { Entity, EntityField } from "../../../../types";
import { classProperty } from "../../../../util/ast";
import { createPrismaFields } from "../../../prisma/create-prisma-schema";
import { CreateApiPropertyDecorator } from "../api-property-decorator/create-api-property-decorator";
import {
  createFieldValueTypeFromPrismaField,
  getTypeName,
} from "../create-field-class-property";
import { createGraphQLFieldDecorator } from "../create-graphql-field-decorator";
import { InputTypeEnum } from "../create-input";

export enum NestedMutationOptions {
  "Create" = "create",
  "Connect" = "connect",
  "ConnectOrCreate" = "connectOrCreate",
}

export function createCreateNestedManyProperties(
  field: EntityField,
  entity: Entity
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
    InputTypeEnum.Create
  );
  return [
    createNestedManyProperty(
      NestedMutationOptions.Connect,
      type,
      prismaField,
      field,
      entity,
      arrayType
    ),
    //TODO
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
  arrayType: TSTypeKind
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
      InputTypeEnum.Create,
      true
    )
  );
  const typeName = getTypeName(
    propertyValueType,
    arrayType,
    prismaField.isList
  );

  decorators.push(
    new CreateApiPropertyDecorator(true, false)
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
