import { registerEnumType } from '@nestjs/graphql';

export enum EnumBuildLogLevel {
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info',
  Debug = 'Debug'
}
registerEnumType(EnumBuildLogLevel, {
  name: 'EnumBuildLogLevel'
});
