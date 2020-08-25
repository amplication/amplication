import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  Admin = 'ADMIN',
  User = 'USER',
  OrganizationAdmin = 'ORGANIZATION_ADMIN',
  ProjectAdmin = 'PROJECT_ADMIN'
}
registerEnumType(Role, {
  name: 'Role',
  description: undefined
});
