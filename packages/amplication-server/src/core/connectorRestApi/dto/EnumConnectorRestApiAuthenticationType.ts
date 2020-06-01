import { registerEnumType } from '@nestjs/graphql';

export enum EnumConnectorRestApiAuthenticationType {
  None = 'None',
  PrivateKey = 'PrivateKey',
  HttpBasicAuthentication = 'HttpBasicAuthentication',
  OAuth2PasswordFlow = 'OAuth2PasswordFlow',
  OAuth2UserAgentFlow = 'OAuth2UserAgentFlow'
}
registerEnumType(EnumConnectorRestApiAuthenticationType, {
  name: 'EnumConnectorRestApiAuthenticationType',
  description: undefined
});
