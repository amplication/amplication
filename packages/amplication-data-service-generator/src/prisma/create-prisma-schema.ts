import * as PrismaSchemaDSL from "prisma-schema-dsl";
import {
  Entity,
  EnumDataType,
  Field,
  LookupProperties,
  OptionSetProperties,
  TwoOptionsProperties,
} from "../types";
import { ScalarType } from "prisma-schema-dsl";

export const CLIENT_GENERATOR = PrismaSchemaDSL.createGenerator(
  "client",
  "prisma-client-js"
);

export const DATA_SOURCE = {
  name: "postgres",
  provider: PrismaSchemaDSL.DataSourceProvider.PostgreSQL,
  url: new PrismaSchemaDSL.DataSourceURLEnv("POSTGRESQL_URL"),
};

/** @todo remove */
export const USER_MODEL = PrismaSchemaDSL.createModel("User", [
  PrismaSchemaDSL.createScalarField(
    "username",
    PrismaSchemaDSL.ScalarType.String,
    false,
    true,
    true
  ),
  PrismaSchemaDSL.createScalarField(
    "password",
    PrismaSchemaDSL.ScalarType.String,
    false,
    true
  ),
]);

export async function createPrismaSchema(entities: Entity[]): Promise<string> {
  const models = entities.map(createPrismaModel);

  /** @todo remove from here */
  models.unshift(USER_MODEL);

  const schema = PrismaSchemaDSL.createSchema(models, DATA_SOURCE, [
    CLIENT_GENERATOR,
  ]);

  return PrismaSchemaDSL.print(schema);
}

export function createPrismaModel(entity: Entity): PrismaSchemaDSL.Model {
  return PrismaSchemaDSL.createModel(
    entity.name,
    entity.fields.map(createPrismaField)
  );
}

export function createPrismaField(
  field: Field
): PrismaSchemaDSL.ScalarField | PrismaSchemaDSL.ObjectField {
  const { dataType, name, properties } = field;
  switch (dataType) {
    case EnumDataType.singleLineText: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      );
    }
    case EnumDataType.multiLineText: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      );
    }
    case EnumDataType.email: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      );
    }
    case EnumDataType.state: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      );
    }
    case EnumDataType.autoNumber: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.Int,
        false,
        true
      );
    }
    case EnumDataType.wholeNumber: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.Int,
        false,
        true
      );
    }
    case EnumDataType.dateTime: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.DateTime,
        false,
        true
      );
    }
    case EnumDataType.decimalNumber: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.Float,
        false,
        true
      );
    }
    case EnumDataType.file: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      );
    }
    case EnumDataType.image: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      );
    }
    case EnumDataType.boolean: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.Boolean,
        false,
        true
      );
    }
    case EnumDataType.uniqueId: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      );
    }
    case EnumDataType.geographicAddress: {
      return PrismaSchemaDSL.createScalarField(
        name,
        PrismaSchemaDSL.ScalarType.String,
        false,
        true
      );
    }
    case EnumDataType.lookup: {
      const {
        relatedEntityId,
        allowMultipleSelection,
      } = properties as LookupProperties;
      return PrismaSchemaDSL.createObjectField(
        name,
        relatedEntityId,
        allowMultipleSelection,
        true
      );
    }
    case EnumDataType.multiSelectOptionSet: {
      const { optionsSetId } = properties as OptionSetProperties;
      /** @todo create an enum */
      return PrismaSchemaDSL.createObjectField(name, optionsSetId, true, true);
    }
    case EnumDataType.optionSet: {
      const { optionsSetId } = properties as OptionSetProperties;
      /** @todo create an enum */
      return PrismaSchemaDSL.createObjectField(name, optionsSetId, false, true);
    }
    case EnumDataType.twoOptions: {
      const enumName = `Enum${field.name}`;
      const {
        default: defaultOption,
        firstOption,
        secondOption,
      } = properties as TwoOptionsProperties;
      /** @todo create an enum */
      return PrismaSchemaDSL.createObjectField(name, enumName, false, true);
    }
    case EnumDataType.id: {
      return PrismaSchemaDSL.createScalarField(
        name,
        ScalarType.String,
        false,
        true,
        false,
        false,
        true
      );
    }
    case EnumDataType.createdAt: {
      /** @todo add default now() */
      return PrismaSchemaDSL.createScalarField(
        name,
        ScalarType.DateTime,
        false,
        true,
        false,
        false,
        false,
        false
      );
    }
    case EnumDataType.updatedAt: {
      return PrismaSchemaDSL.createScalarField(
        name,
        ScalarType.DateTime,
        false,
        true,
        false,
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
