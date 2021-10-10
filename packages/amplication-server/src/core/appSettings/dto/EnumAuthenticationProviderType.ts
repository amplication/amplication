import { registerEnumType } from '@nestjs/graphql';

export enum EnumAuthProviderType {
  Http = 'Http',
  Jwt = 'Jwt'
}

registerEnumType(EnumAuthProviderType, {
  name: 'EnumAuthProviderType'
});
