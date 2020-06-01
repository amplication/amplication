import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { EnumConnectorRestApiAuthenticationType } from './EnumConnectorRestApiAuthenticationType';
import { PrivateKeyAuthenticationSettings } from './PrivateKeyAuthenticationSettings';
import { HttpBasicAuthenticationSettings } from './HttpBasicAuthenticationSettings';

@ObjectType({
  isAbstract: true,
  description: undefined
})
@InputType('ConnectorRestApiSettingsInput', {
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApiSettings {
  @Field(() => EnumConnectorRestApiAuthenticationType, {
    nullable: false,
    description: undefined
  })
  authenticationType!: keyof typeof EnumConnectorRestApiAuthenticationType;

  @Field(() => PrivateKeyAuthenticationSettings, {
    nullable: true,
    description: undefined
  })
  privateKeyAuthenticationSettings: PrivateKeyAuthenticationSettings;

  @Field(() => HttpBasicAuthenticationSettings, {
    nullable: true,
    description: undefined
  })
  httpBasicAuthenticationSettings: HttpBasicAuthenticationSettings;
}
