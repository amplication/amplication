import { registerEnumType } from '@nestjs/graphql';

export enum EnumEntityAction {
  view = 'view',
  create = 'create',
  update = 'update',
  delete = 'delete',
  search = 'search'
}
registerEnumType(EnumEntityAction, {
  name: 'EnumEntityAction',
  description: undefined
});
