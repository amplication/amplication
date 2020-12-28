import * as PrismaSchemaDSL from "prisma-schema-dsl";
import { types } from "@amplication/data";
import { pascalCase } from "pascal-case";
import { Entity, EntityField, EnumDataType } from "../../types";
import { getEnumFields } from "../../util/entity";
import { camelCase } from "camel-case";

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

export async function createPrismaSchema(
  entities: Entity[],
  entityIdToName: Record<string, string>
): Promise<string> {
  const models = entities.map((entity) =>
    createPrismaModel(entity, entityIdToName)
  );

  const enums = entities.flatMap(getEnumFields).map(createPrismaEnum);

  const schema = PrismaSchemaDSL.createSchema(models, enums, DATA_SOURCE, [
    CLIENT_GENERATOR,
  ]);

  return PrismaSchemaDSL.print(schema);
}

export function createPrismaEnum(field: EntityField): PrismaSchemaDSL.Enum {
  const { options } = field.properties as types.OptionSet;
  return PrismaSchemaDSL.createEnum(
    createEnumName(field),
    options.map((option) => option.value)
  );
}

export function createEnumName(field: EntityField): string {
  return `Enum${pascalCase(field.name)}`;
}

export function createPrismaModel(
  entity: Entity,
  entityIdToName: Record<string, string>
): PrismaSchemaDSL.Model {
  return PrismaSchemaDSL.createModel(
    entity.name,
    entity.fields.flatMap((field) => createPrismaFields(field, entityIdToName))
  );
}

export function createPrismaFields(
  field: EntityField,
  entityIdToName: Record<string, string>
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
          field.required
        ),
      ];
    }
    case EnumDataType.MultiLineText: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.String,
          false,
          field.required
        ),
      ];
    }
    case EnumDataType.Email: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.String,
          false,
          field.required
        ),
      ];
    }
    case EnumDataType.WholeNumber: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.Int,
          false,
          field.required
        ),
      ];
    }
    case EnumDataType.DateTime: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.DateTime,
          false,
          field.required
        ),
      ];
    }
    case EnumDataType.DecimalNumber: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.Float,
          false,
          field.required
        ),
      ];
    }
    case EnumDataType.Boolean: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.Boolean,
          false,
          field.required
        ),
      ];
    }
    case EnumDataType.GeographicLocation: {
      return [
        PrismaSchemaDSL.createScalarField(
          name,
          PrismaSchemaDSL.ScalarType.String,
          false,
          field.required
        ),
      ];
    }
    case EnumDataType.Lookup: {
      const {
        relatedEntityId,
        allowMultipleSelection,
      } = properties as types.Lookup;

      const relatedEntityName = entityIdToName[relatedEntityId];

      if (!relatedEntityName) {
        throw new Error(
          `Can't find related entity with ID '${relatedEntityId}' for field '${name}'`
        );
      }

      if (allowMultipleSelection) {
        return [
          PrismaSchemaDSL.createObjectField(
            name,
            relatedEntityName,
            true,
            true,
            name
          ),
        ];
      }

      const relatedEntityIdFieldName =
        relatedEntityName && `${camelCase(relatedEntityName)}Id`;

      return [
        PrismaSchemaDSL.createObjectField(
          name,
          relatedEntityName,
          false,
          field.required,
          name,
          [relatedEntityIdFieldName]
        ),
        PrismaSchemaDSL.createScalarField(
          relatedEntityIdFieldName,
          PrismaSchemaDSL.ScalarType.String,
          false,
          field.required
        ),
      ];
    }
    case EnumDataType.MultiSelectOptionSet: {
      return [
        PrismaSchemaDSL.createObjectField(
          name,
          createEnumName(field),
          true,
          true
        ),
      ];
    }
    case EnumDataType.OptionSet: {
      return [
        PrismaSchemaDSL.createObjectField(
          name,
          createEnumName(field),
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
