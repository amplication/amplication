import * as models from "./models";
import * as schemas from "./schemas";

export const DATA_TYPE_TO_SCHEMA: { [dataType in models.EnumDataType]: any } = {
  [models.EnumDataType.SingleLineText]: schemas.singleLineText,
  [models.EnumDataType.MultiLineText]: schemas.multiLineText,
  [models.EnumDataType.Email]: schemas.email,
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
  [models.EnumDataType.OptionSet]: schemas.optionSet,
  [models.EnumDataType.MultiSelectOptionSet]: schemas.multiSelectOptionSet,
  [models.EnumDataType.Boolean]: schemas.boolean,
  [models.EnumDataType.Id]: schemas.id,
  [models.EnumDataType.CreatedAt]: schemas.createdAt,
  [models.EnumDataType.UpdatedAt]: schemas.updatedAt,
  [models.EnumDataType.GeographicLocation]: schemas.geographicLocation,
  [models.EnumDataType.Password]: schemas.password,
  [models.EnumDataType.Username]: schemas.username,
  [models.EnumDataType.Roles]: schemas.roles,
  [models.EnumDataType.Json]: schemas.json,
};
