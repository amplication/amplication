import { registerEnumType } from '@nestjs/graphql';

export enum EnumAuthProviderType {
  Http = 'HTTP',
  Jwt = 'JWT'
}

registerEnumType(EnumAuthProviderType, {
  name: 'EnumAuthProviderType'
});
