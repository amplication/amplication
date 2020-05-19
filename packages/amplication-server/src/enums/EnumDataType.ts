import { registerEnumType } from '@nestjs/graphql';

export enum EnumDataType {
  singleLineText = 'singleLineText',
  multiLineText = 'multiLineText',
  email = 'email',
  state = 'state',
  autoNumber = 'autoNumber',
  wholeNumber = 'wholeNumber',
  dateTime = 'dateTime',
  decimalNumber = 'decimalNumber',
  file = 'file',
  image = 'image',
  lookup = 'lookup',
  multiSelectOptionSet = 'multiSelectOptionSet',
  optionSet = 'optionSet',
  twoOptions = 'twoOptions',
  boolean = 'boolean',
  uniqueId = 'uniqueId',
  geographicAddress = 'geographicAddress'
}
registerEnumType(EnumDataType, {
  name: 'EnumDataType',
  description: undefined
});
