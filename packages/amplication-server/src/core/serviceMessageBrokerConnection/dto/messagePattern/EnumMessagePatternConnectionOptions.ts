import { registerEnumType } from '@nestjs/graphql';

export enum EnumMessagePatternConnectionOptions {
  'Receive', //! I think its need to be listener and broadcaster
  'Send'
}

registerEnumType(EnumMessagePatternConnectionOptions, {
  name: 'EnumMessagePatternConnectionOptions'
});
