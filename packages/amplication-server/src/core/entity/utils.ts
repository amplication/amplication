import { EnumDataType } from '../../enums/EnumDataType';

export function isJsonType(type: keyof typeof EnumDataType): boolean {
  return type === EnumDataType.Json;
}
