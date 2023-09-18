import {
  CreateSchemaFieldHandler,
  CreateSchemaFieldResult,
  Entity,
  EntityField,
  EnumDataType,
  LookupResolvedProperties,
  types,
} from "@amplication/code-gen-types";
import { camelCase } from "camel-case";
import { pascalCase } from "pascal-case";
import * as PrismaSchemaDSL from "prisma-schema-dsl";
import * as PrismaSchemaDSLTypes from "prisma-schema-dsl-types";

export const CUID_CALL_EXPRESSION: PrismaSchemaDSLTypes.CallExpression = {
  callee: PrismaSchemaDSLTypes.CUID,
};

export const UUID_CALL_EXPRESSION: PrismaSchemaDSLTypes.CallExpression = {
  callee: PrismaSchemaDSLTypes.UUID,
};

export const INCREMENTAL_CALL_EXPRESSION: PrismaSchemaDSLTypes.CallExpression =
  {
    callee: PrismaSchemaDSLTypes.AUTO_INCREMENT,
  };

export const NOW_CALL_EXPRESSION: PrismaSchemaDSLTypes.CallExpression = {
  callee: PrismaSchemaDSLTypes.NOW,
};

export const idTypeToPrismaScalarType: {
  [key in types.Id["idType"]]: PrismaSchemaDSLTypes.ScalarType;
} = {
  AUTO_INCREMENT: PrismaSchemaDSLTypes.ScalarType.Int,
  AUTO_INCREMENT_BIG_INT: PrismaSchemaDSLTypes.ScalarType.BigInt,
  CUID: PrismaSchemaDSLTypes.ScalarType.String,
  UUID: PrismaSchemaDSLTypes.ScalarType.String,
};

export const idTypeToCallExpression: {
  [key in types.Id["idType"]]: PrismaSchemaDSLTypes.CallExpression;
} = {
  AUTO_INCREMENT: INCREMENTAL_CALL_EXPRESSION,
  AUTO_INCREMENT_BIG_INT: INCREMENTAL_CALL_EXPRESSION,
  CUID: CUID_CALL_EXPRESSION,
  UUID: UUID_CALL_EXPRESSION,
};

export const wholeNumberToPrismaScalarType: {
  [key in types.WholeNumber["databaseFieldType"]]: PrismaSchemaDSLTypes.ScalarType;
} = {
  INT: PrismaSchemaDSLTypes.ScalarType.Int,
  BIG_INT: PrismaSchemaDSLTypes.ScalarType.BigInt,
};

export const decimalNumberToPrismaScalarType: {
  [key in types.DecimalNumber["databaseFieldType"]]: PrismaSchemaDSLTypes.ScalarType;
} = {
  DECIMAL: PrismaSchemaDSLTypes.ScalarType.Decimal,
  FLOAT: PrismaSchemaDSLTypes.ScalarType.Float,
};

export function createPrismaFields(
  field: EntityField,
  entity: Entity,
  fieldNamesCount?: Record<string, number>
): CreateSchemaFieldResult {
  return createPrismaSchemaFieldsHandlers[field.dataType](
    field,
    entity,
    fieldNamesCount
  );
}

export const createPrismaSchemaFieldsHandlers: {
  [key in EnumDataType]: CreateSchemaFieldHandler;
} = {
  [EnumDataType.SingleLineText]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createScalarField(
      field.name,
      PrismaSchemaDSLTypes.ScalarType.String,
      false,
      field.required,
      field.unique,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
  [EnumDataType.MultiLineText]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createScalarField(
      field.name,
      PrismaSchemaDSLTypes.ScalarType.String,
      false,
      field.required,
      field.unique,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
  [EnumDataType.Email]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createScalarField(
      field.name,
      PrismaSchemaDSLTypes.ScalarType.String,
      false,
      field.required,
      field.unique,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
  [EnumDataType.WholeNumber]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => {
    const databaseFieldType =
      (field?.properties as types.WholeNumber)?.databaseFieldType ?? "INT";

    return [
      PrismaSchemaDSL.createScalarField(
        field.name,
        wholeNumberToPrismaScalarType[databaseFieldType],
        false,
        field.required,
        field.unique,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        field.customAttributes
      ),
    ];
  },
  [EnumDataType.DateTime]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createScalarField(
      field.name,
      PrismaSchemaDSLTypes.ScalarType.DateTime,
      false,
      field.required,
      field.unique,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
  [EnumDataType.DecimalNumber]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => {
    const databaseFieldType =
      (field?.properties as types.DecimalNumber)?.databaseFieldType ?? "FLOAT";

    return [
      PrismaSchemaDSL.createScalarField(
        field.name,
        decimalNumberToPrismaScalarType[databaseFieldType],
        false,
        field.required,
        field.unique,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        field.customAttributes
      ),
    ];
  },
  [EnumDataType.Boolean]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createScalarField(
      field.name,
      PrismaSchemaDSLTypes.ScalarType.Boolean,
      false,
      field.required,
      field.unique,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
  [EnumDataType.GeographicLocation]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createScalarField(
      field.name,
      PrismaSchemaDSLTypes.ScalarType.String,
      false,
      field.required,
      field.unique,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
  [EnumDataType.Json]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createScalarField(
      field.name,
      PrismaSchemaDSLTypes.ScalarType.Json,
      false,
      field.required,
      field.unique,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
  [EnumDataType.Lookup]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => {
    const { name, properties } = field;
    const {
      relatedEntity,
      relatedField,
      allowMultipleSelection,
      isOneToOneWithoutForeignKey,
    } = properties as LookupResolvedProperties;
    const hasAnotherRelation = entity.fields.some(
      (entityField) =>
        entityField.id !== field.id &&
        entityField.dataType === EnumDataType.Lookup &&
        entityField.properties.relatedEntity.name === relatedEntity.name
    );

    const relationName = !hasAnotherRelation
      ? null
      : createRelationName(
          entity,
          field,
          relatedEntity,
          relatedField,
          fieldNamesCount[field.name] === 1,
          fieldNamesCount[relatedField.name] === 1
        );

    if (allowMultipleSelection || isOneToOneWithoutForeignKey) {
      return [
        PrismaSchemaDSL.createObjectField(
          name,
          relatedEntity.name,
          !isOneToOneWithoutForeignKey,
          allowMultipleSelection || false,
          relationName
        ),
      ];
    }

    const scalarRelationFieldName = field.properties.fkFieldName;

    const relatedEntityFiledId = relatedEntity.fields?.find(
      (relatedEntityField) => relatedEntityField.dataType === EnumDataType.Id
    );

    const idType =
      (relatedEntityFiledId?.properties as types.Id)?.idType ?? "CUID";

    return [
      PrismaSchemaDSL.createObjectField(
        name,
        relatedEntity.name,
        false,
        field.required,
        relationName,
        [scalarRelationFieldName],
        [
          "id",
        ] /**@todo: calculate the referenced field on the related entity (currently it is always 'id') */,
        undefined,
        undefined,
        undefined,
        field.customAttributes
      ),
      // Prisma Scalar Relation Field
      PrismaSchemaDSL.createScalarField(
        scalarRelationFieldName,
        idTypeToPrismaScalarType[idType],
        false,
        field.required,
        !field.properties.allowMultipleSelection &&
          !relatedField?.properties.allowMultipleSelection &&
          !isOneToOneWithoutForeignKey
          ? true
          : field.unique,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        field.customAttributes
      ),
    ];
  },
  [EnumDataType.MultiSelectOptionSet]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createObjectField(
      field.name,
      createEnumName(field, entity),
      true,
      true,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
  [EnumDataType.OptionSet]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createObjectField(
      field.name,
      createEnumName(field, entity),
      false,
      field.required,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
  [EnumDataType.Id]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => {
    const { name, properties } = field;
    const idType = (properties as types.Id)?.idType ?? "CUID";

    return [
      PrismaSchemaDSL.createScalarField(
        name,
        idTypeToPrismaScalarType[idType],
        false,
        field.required,
        false,
        true,
        false,
        idTypeToCallExpression[idType],
        undefined,
        undefined,
        field.customAttributes
      ),
    ];
  },
  [EnumDataType.CreatedAt]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createScalarField(
      field.name,
      PrismaSchemaDSLTypes.ScalarType.DateTime,
      false,
      field.required,
      false,
      false,
      false,
      NOW_CALL_EXPRESSION,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
  [EnumDataType.UpdatedAt]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createScalarField(
      field.name,
      PrismaSchemaDSLTypes.ScalarType.DateTime,
      false,
      field.required,
      false,
      false,
      true,
      undefined,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
  [EnumDataType.Roles]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createScalarField(
      field.name,
      PrismaSchemaDSLTypes.ScalarType.Json,
      false,
      true,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
  [EnumDataType.Username]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createScalarField(
      field.name,
      PrismaSchemaDSLTypes.ScalarType.String,
      false,
      field.required,
      true,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
  [EnumDataType.Password]: (
    field: EntityField,
    entity: Entity,
    fieldNamesCount: Record<string, number> = {}
  ) => [
    PrismaSchemaDSL.createScalarField(
      field.name,
      PrismaSchemaDSLTypes.ScalarType.String,
      false,
      field.required,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      field.customAttributes
    ),
  ],
};

/**
 * Creates Prisma Schema relation name according to the names of the entity,
 * field, relatedEntity and relatedField.
 * This function is assumed to be used when a relation name is necessary
 * @param entity
 * @param field
 * @param relatedEntity
 * @param relatedField
 * @param fieldHasUniqueName
 * @returns Prisma Schema relation name
 * @todo use unique name of one of the fields deterministically (VIPCustomers or VIPOrganizations)
 */
export function createRelationName(
  entity: Entity,
  field: EntityField,
  relatedEntity: Entity,
  relatedField: EntityField,
  fieldHasUniqueName: boolean,
  relatedFieldHasUniqueName: boolean
): string {
  const relatedEntityNames = [
    relatedEntity.name,
    pascalCase(relatedEntity.pluralName),
  ];
  const entityNames = [entity.name, pascalCase(entity.pluralName)];
  const matchingRelatedEntityName = relatedEntityNames.find(
    (name) => field.name === camelCase(name)
  );
  const matchingEntityName = entityNames.find(
    (name) => relatedField.name === camelCase(name)
  );
  if (matchingRelatedEntityName && matchingEntityName) {
    const names = [matchingRelatedEntityName, matchingEntityName];
    // Sort names for deterministic results regardless of entity and related order
    names.sort();
    return names.join("On");
  }
  if (fieldHasUniqueName || relatedFieldHasUniqueName) {
    const names = [];
    if (fieldHasUniqueName) {
      names.push(field.name);
    }
    if (relatedFieldHasUniqueName) {
      names.push(relatedField.name);
    }
    // Sort names for deterministic results regardless of entity and related order
    names.sort();
    return names[0];
  }
  const entityAndField = [entity.name, field.name].join(" ");
  const relatedEntityAndField = [relatedEntity.name, relatedField.name].join(
    " "
  );
  const parts = [entityAndField, relatedEntityAndField];
  // Sort parts for deterministic results regardless of entity and related order
  parts.sort();
  return pascalCase(parts.join(" "));
}

export function createEnumName(field: EntityField, entity: Entity): string {
  return `Enum${pascalCase(entity.name)}${pascalCase(field.name)}`;
}
