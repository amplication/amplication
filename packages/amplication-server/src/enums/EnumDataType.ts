import { registerEnumType } from '@nestjs/graphql';

export enum EnumDataType {
  SingleLineText = 'SingleLineText',
  MultiLineText = 'MultiLineText',
  Email = 'Email',
  AutoNumber = 'AutoNumber',
  WholeNumber = 'WholeNumber',
  DateTime = 'DateTime',
  DecimalNumber = 'DecimalNumber',
  Lookup = 'Lookup',
  MultiSelectOptionSet = 'MultiSelectOptionSet',
  OptionSet = 'OptionSet',
  Boolean = 'Boolean',
  GeographicAddress = 'GeographicAddress',
  Id = 'Id',
  CreatedAt = 'CreatedAt',
  UpdatedAt = 'UpdatedAt'
}
registerEnumType(EnumDataType, {
  name: 'EnumDataType',
  description: undefined
});
