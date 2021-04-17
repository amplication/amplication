import { registerEnumType } from '@nestjs/graphql';

export enum EnumDataType {
  SingleLineText = 'SingleLineText',
  MultiLineText = 'MultiLineText',
  Email = 'Email',
  WholeNumber = 'WholeNumber',
  DateTime = 'DateTime',
  DecimalNumber = 'DecimalNumber',
  Lookup = 'Lookup',
  MultiSelectOptionSet = 'MultiSelectOptionSet',
  OptionSet = 'OptionSet',
  Boolean = 'Boolean',
  GeographicLocation = 'GeographicLocation',
  Id = 'Id',
  CreatedAt = 'CreatedAt',
  UpdatedAt = 'UpdatedAt',
  Roles = 'Roles',
  Username = 'Username',
  Password = 'Password',
  Json = 'Json'
}
registerEnumType(EnumDataType, {
  name: 'EnumDataType',
  description: undefined
});
