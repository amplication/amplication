import { registerEnumType } from '@nestjs/graphql';

export enum EnumActionLogLevel {
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info',
  Debug = 'Debug'
}
registerEnumType(EnumActionLogLevel, {
  name: 'EnumActionLogLevel'
});
