import { registerEnumType } from '@nestjs/graphql';

export enum EnumAuthProviderType {
  Basic = 'Basic',
  Jwt = 'Jwt'
}

registerEnumType(EnumAuthProviderType, {
  name: 'EnumAuthProviderType'
});
