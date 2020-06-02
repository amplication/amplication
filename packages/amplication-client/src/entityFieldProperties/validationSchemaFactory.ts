import { EnumDataType } from "./EnumDataType";
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
import uniqueId from "./schemas/uniqueId.json";
import geographicAddress from "./schemas/geographicAddress.json";

type Schema = {
  type: string;
  properties: {
    [property: string]: {
      type: string;
    };
  };
};

const schemas: {
  [dataType in EnumDataType]: Schema;
} = {
  singleLineText,
  multiLineText,
  email,
  /** @todo check if each is unique */
  state,
  autoNumber,
  /** @todo reference to minimumValue */
  wholeNumber,
  dateTime,
  /**
   * @todo reference to minimumValue
   * @todo Check for the right value for precision
   */
  decimalNumber,
  /** @todo move maximum file size to system settings */
  file,
  /** @todo move maximum file size to system settings */
  image,
  /** @todo validate the actual selected entity */
  lookup,
  /** @todo validate the actual selected option set */
  optionSet,
  /** @todo validate the actual selected option set */
  multiSelectOptionSet,
  /** @todo validate default against one of the option values */
  twoOptions,
  boolean,
  uniqueId,
  geographicAddress,
};

export function getSchema(dataType: EnumDataType): Schema {
  return schemas[dataType];
}
