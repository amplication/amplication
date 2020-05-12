import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  ORGANIZATION_ADMIN = 'ORGANIZATION_ADMIN',
  PROJECT_ADMIN = 'PROJECT_ADMIN'
}
registerEnumType(Role, {
  name: 'Role',
  description: undefined
});
