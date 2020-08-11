import { registerEnumType } from '@nestjs/graphql';

export enum EnumDataType {
  SingleLineText = 'singleLineText',
  MultiLineText = 'multiLineText',
  Email = 'email',
  State = 'state',
  AutoNumber = 'autoNumber',
  WholeNumber = 'wholeNumber',
  DateTime = 'dateTime',
  DecimalNumber = 'decimalNumber',
  File = 'file',
  Image = 'image',
  Lookup = 'lookup',
  MultiSelectOptionSet = 'multiSelectOptionSet',
  OptionSet = 'optionSet',
  TwoOptions = 'twoOptions',
  Boolean = 'boolean',
  UniqueId = 'uniqueId',
  GeographicAddress = 'geographicAddress',
  Id = 'id',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt'
}
registerEnumType(EnumDataType, {
  name: 'EnumDataType',
  description: undefined
});
