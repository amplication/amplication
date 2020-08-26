import { registerEnumType } from '@nestjs/graphql';

export enum EnumPendingChangeObjectType {
  Entity = 'Entity',
  Block = 'Block'
}

registerEnumType(EnumPendingChangeObjectType, {
  name: 'EnumPendingChangeObjectType'
});
