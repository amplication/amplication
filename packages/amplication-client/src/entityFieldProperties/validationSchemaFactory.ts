import * as models from "../models";
import singleLineText from "./schemas/singleLineText.json";
import multiLineText from "./schemas/multiLineText.json";
import email from "./schemas/email.json";
import state from "./schemas/state.json";
import autoNumber from "./schemas/autoNumber.json";
import wholeNumber from "./schemas/wholeNumber.json";
import dateTime from "./schemas/dateTime.json";
import decimalNumber from "./schemas/decimalNumber.json";
import file from "./schemas/file.json";
import image from "./schemas/image.json";
import lookup from "./schemas/lookup.json";
import optionSet from "./schemas/optionSet.json";
import multiSelectOptionSet from "./schemas/multiSelectOptionSet.json";
import twoOptions from "./schemas/twoOptions.json";
import boolean from "./schemas/boolean.json";
import id from "./schemas/id.json";
import createdAt from "./schemas/createdAt.json";
import updatedAt from "./schemas/updatedAt.json";
import geographicAddress from "./schemas/geographicAddress.json";

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

const schemas: {
  [dataType in models.EnumDataType]: Schema;
} = {
  [models.EnumDataType.SingleLineText]: singleLineText,
  [models.EnumDataType.MultiLineText]: multiLineText,
  [models.EnumDataType.Email]: email,
  /** @todo check if each is unique */
  [models.EnumDataType.State]: state,
  [models.EnumDataType.AutoNumber]: autoNumber,
  /** @todo reference to minimumValue */
  [models.EnumDataType.WholeNumber]: wholeNumber,
  [models.EnumDataType.DateTime]: dateTime,
  /**
   * @todo reference to minimumValue
   * @todo Check for the right value for precision
   */
  [models.EnumDataType.DecimalNumber]: decimalNumber,
  /** @todo move maximum file size to system settings */
  [models.EnumDataType.File]: file,
  /** @todo move maximum file size to system settings */
  [models.EnumDataType.Image]: image,
  /** @todo validate the actual selected entity */
  [models.EnumDataType.Lookup]: lookup,
  /** @todo validate the actual selected option set */
  [models.EnumDataType.OptionSet]: optionSet,
  /** @todo validate the actual selected option set */
  [models.EnumDataType.MultiSelectOptionSet]: multiSelectOptionSet,
  /** @todo validate default against one of the option values */
  [models.EnumDataType.TwoOptions]: twoOptions,
  [models.EnumDataType.Boolean]: boolean,
  [models.EnumDataType.Id]: id,
  [models.EnumDataType.CreatedAt]: createdAt,
  [models.EnumDataType.UpdatedAt]: updatedAt,
  [models.EnumDataType.GeographicAddress]: geographicAddress,
};

export function getSchema(dataType: models.EnumDataType): Schema {
  return schemas[dataType];
}
