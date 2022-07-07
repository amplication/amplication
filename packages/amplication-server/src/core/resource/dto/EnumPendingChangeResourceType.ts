import { registerEnumType } from '@nestjs/graphql';

export enum EnumPendingChangeResourceType {
  Entity = 'Entity',
  Block = 'Block'
}

registerEnumType(EnumPendingChangeResourceType, {
  name: 'EnumPendingChangeResourceType'
});
