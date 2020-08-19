import { registerEnumType } from '@nestjs/graphql';

export enum EnumEntityFieldAction {
  View = 'View',
  Update = 'Update',
  Search = 'Search'
}
registerEnumType(EnumEntityFieldAction, {
  name: 'EnumEntityFieldAction',
  description: undefined
});
