import { registerEnumType } from '@nestjs/graphql';

export enum EnumPendingChangeAction {
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete'
}

registerEnumType(EnumPendingChangeAction, {
  name: 'EnumPendingChangeAction'
});
