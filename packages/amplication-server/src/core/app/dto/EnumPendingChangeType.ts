import { registerEnumType } from '@nestjs/graphql';

export enum EnumPendingChangeType {
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete'
}

registerEnumType(EnumPendingChangeType, {
  name: 'EnumPendingChangeType'
});
