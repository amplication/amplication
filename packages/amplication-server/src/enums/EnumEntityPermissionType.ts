import { registerEnumType } from '@nestjs/graphql';

export enum EnumEntityPermissionType {
  AllRoles = 'AllRoles',
  Granular = 'Granular',
  Disabled = 'Disabled',
  Public = 'Public'
}
registerEnumType(EnumEntityPermissionType, {
  name: 'EnumEntityPermissionType'
});
