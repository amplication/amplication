import { schemas } from "amplication-data";
import * as models from "../models";

export type SchemaProperty = {
  type: string;
  description?: string;
  default?: string | number | boolean | string[];
  enum?: string[];
  minimum?: number;
  maximum?: number;
  items?: SchemaProperty;
};

export type Schema = {
  type: string;
  title: string;
  required?: string[];
  properties: {
    [property: string]: SchemaProperty;
  };
};

type DataTypeToSchema = {
  [dataType in models.EnumDataType]: Schema;
};

const dataTypeToSchema: DataTypeToSchema = {
  [models.EnumDataType.SingleLineText]: schemas.singleLineText,
  [models.EnumDataType.MultiLineText]: schemas.multiLineText,
  [models.EnumDataType.Email]: schemas.email,
  [models.EnumDataType.AutoNumber]: schemas.autoNumber,
  /** @todo reference to minimumValue */
  [models.EnumDataType.WholeNumber]: schemas.wholeNumber,
  [models.EnumDataType.DateTime]: schemas.dateTime,
  /**
   * @todo reference to minimumValue
   * @todo Check for the right value for precision
   */
  [models.EnumDataType.DecimalNumber]: schemas.decimalNumber,
  /** @todo validate the actual selected entity */
  [models.EnumDataType.Lookup]: schemas.lookup,
  /** @todo validate the actual selected option set */
  [models.EnumDataType.OptionSet]: schemas.optionSet,
  /** @todo validate the actual selected option set */
  [models.EnumDataType.MultiSelectOptionSet]: schemas.multiSelectOptionSet,
  [models.EnumDataType.Boolean]: schemas.boolean,
  [models.EnumDataType.Id]: schemas.id,
  [models.EnumDataType.CreatedAt]: schemas.createdAt,
  [models.EnumDataType.UpdatedAt]: schemas.updatedAt,
  [models.EnumDataType.GeographicAddress]: schemas.geographicAddress,
};

export function getSchema(dataType: models.EnumDataType): Schema {
  return dataTypeToSchema[dataType];
}
