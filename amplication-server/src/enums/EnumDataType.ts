import { registerEnumType } from '@nestjs/graphql';

export enum EnumDataType {
  Text = 'Text',
  AutoNumber = 'AutoNumber',
  WholeNumber = 'WholeNumber',
  TimeZone = 'TimeZone',
  Language = 'Language',
  DateAndTime = 'DateAndTime',
  Currancy = 'Currancy',
  DecimalNumber = 'DecimalNumber',
  File = 'File',
  Image = 'Image',
  Lookup = 'Lookup',
  CustomEntity = 'CustomEntity',
  OptionSet = 'OptionSet',
  Boolean = 'Boolean',
  Color = 'Color',
  Guid = 'Guid',
  Time = 'Time',
  CalculatedField = 'CalculatedField',
  RollupField = 'RollupField'
}
registerEnumType(EnumDataType, {
  name: 'EnumDataType',
  description: undefined
});
