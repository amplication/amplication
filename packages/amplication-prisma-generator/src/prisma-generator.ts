import * as PrismaSchemaDSL from "prisma-schema-dsl";
import { Entity, EnumDataType, Field } from "./types";
import { createScalarField, ScalarType } from "prisma-schema-dsl";

export const HEADER = `generator client {
  provider = "prisma-client-js"
}`;

export const USER_MODEL = PrismaSchemaDSL.createModel("User", [
  PrismaSchemaDSL.createScalarField(
    "username",
    ScalarType.String,
    false,
    true,
    true
  ),
  PrismaSchemaDSL.createScalarField("password", ScalarType.String, false, true),
]);

export async function createPrismaSchema(
  dataSource: PrismaSchemaDSL.DataSource,
  entities: Entity[]
): Promise<string> {
  const models = entities.map(createPrismaModel);

  /** @todo remove from here */
  models.unshift(USER_MODEL);

  const schema = PrismaSchemaDSL.createSchema(models, dataSource);
  const schemaCode = await PrismaSchemaDSL.print(schema);
  return [HEADER, schemaCode].join("\n\n");
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
  const { dataType, name } = field;
  switch (dataType) {
    case EnumDataType.singleLineText: {
      return createScalarField(name, ScalarType.String, false, true);
    }
    case EnumDataType.multiLineText: {
      return createScalarField(name, ScalarType.String, false, true);
    }
    case EnumDataType.email: {
      return createScalarField(name, ScalarType.String, false, true);
    }
    case EnumDataType.state: {
      return createScalarField(name, ScalarType.String, false, true);
    }
    case EnumDataType.autoNumber: {
      return createScalarField(name, ScalarType.Int, false, true);
    }
    case EnumDataType.wholeNumber: {
      return createScalarField(name, ScalarType.Int, false, true);
    }
    case EnumDataType.dateTime: {
      return createScalarField(name, ScalarType.DateTime, false, true);
    }
    case EnumDataType.decimalNumber: {
      return createScalarField(name, ScalarType.Float, false, true);
    }
    case EnumDataType.file: {
      return createScalarField(name, ScalarType.String, false, true);
    }
    case EnumDataType.image: {
      return createScalarField(name, ScalarType.String, false, true);
    }
    case EnumDataType.boolean: {
      return createScalarField(name, ScalarType.Boolean, false, true);
    }
    case EnumDataType.uniqueId: {
      return createScalarField(name, ScalarType.String, false, true);
    }
    case EnumDataType.geographicAddress: {
      return createScalarField(name, ScalarType.String, false, true);
    }
    default: {
      throw new Error(`Unfamiliar data type: ${dataType}`);
    }
  }
}
