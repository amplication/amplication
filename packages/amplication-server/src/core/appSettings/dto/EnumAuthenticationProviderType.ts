import { registerEnumType } from '@nestjs/graphql';

export enum AuthProviderType {
  Http = 'HTTP',
  Jwt = 'JWT'
}

registerEnumType(AuthProviderType, {
  name: 'AuthProviderType'
});
