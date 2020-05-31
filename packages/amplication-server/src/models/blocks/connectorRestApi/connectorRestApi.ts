import { Field, ObjectType } from '@nestjs/graphql';
import { createUnionType } from '@nestjs/graphql';
import { Block } from '../block';
import { EnumConnectorRestApiAuthenticationType } from './EnumConnectorRestApiAuthenticationType';
import { PrivateKeyAuthenticationSettings } from './PrivateKeyAuthenticationSettings';
import { HttpBasicAuthenticationSettings } from './HttpBasicAuthenticationSettings';

const authenticationSettingsType = createUnionType({
  name: 'authenticationSettings', // the name of the GraphQL union
  types: () => [
    PrivateKeyAuthenticationSettings,
    HttpBasicAuthenticationSettings
  ] // function that returns tuple of object types classes
});

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApi extends Block {
  @Field(_type => EnumConnectorRestApiAuthenticationType, {
    nullable: false,
    description: undefined
  })
  authenticationType!: keyof typeof EnumConnectorRestApiAuthenticationType;

  @Field(_type => authenticationSettingsType, {
    nullable: false,
    description: undefined
  })
  authenticationSettings!:
    | PrivateKeyAuthenticationSettings
    | HttpBasicAuthenticationSettings;
}
