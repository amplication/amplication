import { registerEnumType } from '@nestjs/graphql';

export enum EnumEntityPermissionType {
  AllRoles = 'AllRoles',
  Granular = 'Granular',
  Disabled = 'Disabled'
}
registerEnumType(EnumEntityPermissionType, {
  name: 'EnumEntityPermissionType',
  description: undefined
});
