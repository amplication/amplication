import * as PrismaSchemaDSL from "prisma-schema-dsl";
import { types } from "amplication-data";
import { pascalCase } from "pascal-case";
import { USER_MODEL } from "./user-model";
import * as models from "../models";
import { FullEntity, FullEntityField } from "../types";

export const CLIENT_GENERATOR = PrismaSchemaDSL.createGenerator(
  "client",
  "prisma-client-js"
);

export const DATA_SOURCE = {
  name: "postgres",
  provider: PrismaSchemaDSL.DataSourceProvider.PostgreSQL,
  url: new PrismaSchemaDSL.DataSourceURLEnv("POSTGRESQL_URL"),
};

export async function createPrismaSchema(
  entities: FullEntity[]
): Promise<string> {
  const models = entities.map(createPrismaModel);
  const userModel = models.find((model) => model.name === USER_MODEL.name);
  if (userModel) {
    userModel.fields.unshift(...USER_MODEL.fields);
  } else {
    models.unshift(USER_MODEL);
  }

  const enums = entities
    .flatMap((entity) => entity.fields)
    .map((field) => createPrismaEnum(field))
    .filter((enum_): enum_ is PrismaSchemaDSL.Enum => enum_ !== null);

  const schema = PrismaSchemaDSL.createSchema(models, enums, DATA_SOURCE, [
    CLIENT_GENERATOR,
  ]);

  return PrismaSchemaDSL.print(schema);
}

export function createPrismaEnum(
  field: FullEntityField
): PrismaSchemaDSL.Enum | null {
  const { dataType, properties } = field;
  switch (dataType) {
    case models.EnumDataType.MultiSelectOptionSet:
    case models.EnumDataType.OptionSet: {
      const { options } = properties as types.OptionSet;
      return PrismaSchemaDSL.createEnum(
        createEnumName(field),
        options.map((option) => option.value)
      );
    }
    default: {
      return null;
    }
  }
}

function createEnumName(field: FullEntityField): string {
  return `Enum${pascalCase(field.name)}`;
}

export function createPrismaModel(entity: FullEntity): PrismaSchemaDSL.Model {
  return PrismaSchemaDSL.createModel(
    entity.name,
    entity.fields.map(createPrismaField)
  );
}

export function createPrismaField(
  field: FullEntityField
): PrismaSchemaDSL.ScalarField | PrismaSchemaDSL.ObjectField {
  const { dataType, name, properties } = field;
  switch (dataType) {
    case models.EnumDataType.SingleLineText: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      );
    }
    case models.EnumDataType.MultiLineText: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      );
    }
    case models.EnumDataType.Email: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      );
    }
    case models.EnumDataType.AutoNumber: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.Int,
        false,
        true
      );
    }
    case models.EnumDataType.WholeNumber: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.Int,
        false,
        true
      );
    }
    case models.EnumDataType.DateTime: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.DateTime,
        false,
        true
      );
    }
    case models.EnumDataType.DecimalNumber: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.Float,
        false,
        true
      );
    }
    case models.EnumDataType.Boolean: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.Boolean,
        false,
        true
      );
    }
    case models.EnumDataType.GeographicAddress: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      );
    }
    case models.EnumDataType.Lookup: {
      const {
        relatedEntityId,
        allowMultipleSelection,
      } = properties as types.Lookup;
      return PrismaSchemaDSL.createObjectField(
        name,
        relatedEntityId,
        allowMultipleSelection,
        true
      );
    }
    case models.EnumDataType.MultiSelectOptionSet: {
      return PrismaSchemaDSL.createObjectField(
        name,
        createEnumName(field),
        true,
        true
      );
    }
    case models.EnumDataType.OptionSet: {
      return PrismaSchemaDSL.createObjectField(
        name,
        createEnumName(field),
        false,
        true
      );
    }
    case models.EnumDataType.Id: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true,
        false,
        true,
        false,
        new PrismaSchemaDSL.CallExpression(PrismaSchemaDSL.CUID)
      );
    }
    case models.EnumDataType.CreatedAt: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.DateTime,
        false,
        true,
        false,
        false,
        false,
        new PrismaSchemaDSL.CallExpression(PrismaSchemaDSL.NOW)
      );
    }
    case models.EnumDataType.UpdatedAt: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.DateTime,
        false,
        true,
        false,
        false,
        true
      );
    }
    default: {
      throw new Error(`Unfamiliar data type: ${dataType}`);
    }
  }
}
