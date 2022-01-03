import { EnumDataType } from "./models";

export const DATA_TYPES = Object.keys(EnumDataType) as Array<
  keyof typeof EnumDataType
>;
