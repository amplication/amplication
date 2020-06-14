import { Field, InputType } from '@nestjs/graphql';
import { JsonValue } from 'type-fest';
import { EnumConnectorRestApiAuthenticationType } from './EnumConnectorRestApiAuthenticationType';
import { PrivateKeyAuthenticationSettings } from './PrivateKeyAuthenticationSettings';
import { HttpBasicAuthenticationSettings } from './HttpBasicAuthenticationSettings';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApiCreateInput extends BlockCreateInput {
  @Field(() => EnumConnectorRestApiAuthenticationType, {
    nullable: false,
    description: undefined
  })
  authenticationType!: keyof typeof EnumConnectorRestApiAuthenticationType;

  @Field(() => PrivateKeyAuthenticationSettings, {
    nullable: true,
    description: undefined
  })
  privateKeyAuthenticationSettings: PrivateKeyAuthenticationSettings &
    JsonValue;

  @Field(() => HttpBasicAuthenticationSettings, {
    nullable: true,
    description: undefined
  })
  httpBasicAuthenticationSettings: HttpBasicAuthenticationSettings & JsonValue;
}
