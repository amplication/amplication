import * as PrismaSchemaDSL from "prisma-schema-dsl";
import { camelCase } from "camel-case";
import { pascalCase } from "pascal-case";
import { types } from "@amplication/data";
import countBy from "lodash.countby";
import {
  Entity,
  EntityField,
  EnumDataType,
  LookupResolvedProperties,
} from "../../types";
import { getEnumFields } from "../../util/entity";

export const CLIENT_GENERATOR = PrismaSchemaDSL.createGenerator(
  "client",
  "prisma-client-js"
);

export const DATA_SOURCE = {
  name: "postgres",
  provider: PrismaSchemaDSL.DataSourceProvider.PostgreSQL,
  url: new PrismaSchemaDSL.DataSourceURLEnv("POSTGRESQL_URL"),
};

export const CUID_CALL_EXPRESSION = new PrismaSchemaDSL.CallExpression(
  PrismaSchemaDSL.CUID
);

export const NOW_CALL_EXPRESSION = new PrismaSchemaDSL.CallExpression(
  PrismaSchemaDSL.NOW
);

export async function createPrismaSchema(entities: Entity[]): Promise<string> {
  const fieldNamesCount = countBy(
    entities.flatMap((entity) => entity.fields),
    "name"
  );
  const models = entities.map((entity) =>
    createPrismaModel(entity, fieldNamesCount)
  );

  const enums = entities.flatMap((entity) => {
    const enumFields = getEnumFields(entity);
    return enumFields.map((field) => createPrismaEnum(field, entity));
  });

  const schema = PrismaSchemaDSL.createSchema(models, enums, DATA_SOURCE, [
    CLIENT_GENERATOR,
  ]);

  return PrismaSchemaDSL.print(schema);
}

export function createPrismaEnum(
  field: EntityField,
  entity: Entity
): PrismaSchemaDSL.Enum {
  const { options } = field.properties as types.OptionSet;
  return PrismaSchemaDSL.createEnum(
    createEnumName(field, entity),
    options.map((option) => option.value)
  );
}

export function createEnumName(field: EntityField, entity: Entity): string {
  return `Enum${pascalCase(entity.name)}${pascalCase(field.name)}`;
}

export function createPrismaModel(
  entity: Entity,
  fieldNamesCount: Record<string, number>
): PrismaSchemaDSL.Model {
  return PrismaSchemaDSL.createModel(
    entity.name,
    entity.fields.flatMap((field) =>
      createPrismaFields(field, entity, fieldNamesCount)
    )
  );
}
export function createPrismaFields(
  field: EntityField,
  entity: Entity,
  fieldNamesCount: Record<string, number> = {}
):
  | [PrismaSchemaDSL.ScalarField]
  | [PrismaSchemaDSL.ObjectField]
  | [PrismaSchemaDSL.ObjectField, PrismaSchemaDSL.ScalarField] {
  const { dataType, name, properties } = field;
  switch (dataType) {
    case EnumDataType.SingleLineText: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.String,
          false,
          field.required,
          field.unique
        ),
      ];
    }
    case EnumDataType.MultiLineText: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.String,
          false,
          field.required,
          field.unique
        ),
      ];
    }
    case EnumDataType.Email: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.String,
          false,
          field.required,
          field.unique
        ),
      ];
    }
    case EnumDataType.WholeNumber: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.Int,
          false,
          field.required,
          field.unique
        ),
      ];
    }
    case EnumDataType.DateTime: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.DateTime,
          false,
          field.required,
          field.unique
        ),
      ];
    }
    case EnumDataType.DecimalNumber: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.Float,
          false,
          field.required,
          field.unique
        ),
      ];
    }
    case EnumDataType.Boolean: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.Boolean,
          false,
          field.required,
          field.unique
        ),
      ];
    }
    case EnumDataType.GeographicLocation: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.String,
          false,
          field.required,
          field.unique
        ),
      ];
    }
    case EnumDataType.Json: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.Json,
          false,
          field.required,
          field.unique
        ),
      ];
    }
    case EnumDataType.Lookup: {
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
            true,
            relationName
          ),
        ];
      }

      const scalarRelationFieldName = `${name}Id`;

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
          ] /**@todo: calculate the referenced field on the related entity (currently it is always 'id') */
        ),
        // Prisma Scalar Relation Field
        PrismaSchemaDSL.createScalarField(
          scalarRelationFieldName,
          PrismaSchemaDSL.ScalarType.String,
          false,
          field.required,
          field.unique
        ),
      ];
    }
    case EnumDataType.MultiSelectOptionSet: {
      return [
        PrismaSchemaDSL.createObjectField(
          name,
          createEnumName(field, entity),
          true,
          true
        ),
      ];
    }
    case EnumDataType.OptionSet: {
      return [
        PrismaSchemaDSL.createObjectField(
          name,
          createEnumName(field, entity),
          false,
          field.required
        ),
      ];
    }
    case EnumDataType.Id: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.String,
          false,
          field.required,
          false,
          true,
          false,
          CUID_CALL_EXPRESSION
        ),
      ];
    }
    case EnumDataType.CreatedAt: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.DateTime,
          false,
          field.required,
          false,
          false,
          false,
          NOW_CALL_EXPRESSION
        ),
      ];
    }
    case EnumDataType.UpdatedAt: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.DateTime,
          false,
          field.required,
          false,
          false,
          true
        ),
      ];
    }
    case EnumDataType.Roles: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.String,
          true,
          true
        ),
      ];
    }
    case EnumDataType.Username: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.String,
          false,
          field.required,
          true
        ),
      ];
    }
    case EnumDataType.Password: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.String,
          false,
          field.required
        ),
      ];
    }
    default: {
      throw new Error(`Unfamiliar data type: ${dataType}`);
    }
  }
}

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
    relatedEntity.pluralDisplayName,
  ];
  const entityNames = [entity.name, entity.pluralDisplayName];
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
