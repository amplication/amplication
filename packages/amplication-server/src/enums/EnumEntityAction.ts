import { registerEnumType } from '@nestjs/graphql';

export enum EnumEntityAction {
  View = 'View',
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
  Search = 'Search'
}
registerEnumType(EnumEntityAction, {
  name: 'EnumEntityAction',
  description: undefined
});
