import { JSONSchema7 } from "json-schema";
import * as models from "./models";
import * as schemas from "./schemas";

export type Schema = JSONSchema7;

export type DataTypeToSchema = {
  [dataType in models.EnumDataType]: Schema;
};

export const dataTypeToSchema: DataTypeToSchema = {
  [models.EnumDataType.SingleLineText]: schemas.singleLineText as Schema,
  [models.EnumDataType.MultiLineText]: schemas.multiLineText as Schema,
  [models.EnumDataType.Email]: schemas.email as Schema,
  /** @todo reference to minimumValue */
  [models.EnumDataType.WholeNumber]: schemas.wholeNumber as Schema,
  [models.EnumDataType.DateTime]: schemas.dateTime as Schema,
  /**
   * @todo reference to minimumValue
   * @todo Check for the right value for precision
   */
  [models.EnumDataType.DecimalNumber]: schemas.decimalNumber as Schema,
  /** @todo validate the actual selected entity */
  [models.EnumDataType.Lookup]: schemas.lookup as Schema,
  /** @todo validate the actual selected option set */
  [models.EnumDataType.OptionSet]: schemas.optionSet as Schema,
  /** @todo validate the actual selected option set */
  [models.EnumDataType
    .MultiSelectOptionSet]: schemas.multiSelectOptionSet as Schema,
  [models.EnumDataType.Boolean]: schemas.boolean as Schema,
  [models.EnumDataType.Id]: schemas.id as Schema,
  [models.EnumDataType.CreatedAt]: schemas.createdAt as Schema,
  [models.EnumDataType.UpdatedAt]: schemas.updatedAt as Schema,
  [models.EnumDataType.GeographicAddress]: schemas.geographicAddress as Schema,
};

export function getSchemaForDataType(dataType: models.EnumDataType): Schema {
  return dataTypeToSchema[dataType];
}
