import { registerEnumType } from '@nestjs/graphql';

export enum EnumRoleLevel {
  Workspace = 'Workspace',
  Project = 'Project'
}
registerEnumType(EnumRoleLevel, {
  name: 'EnumRoleLevel',
  description: undefined
});
