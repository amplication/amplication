import { Field, InputType } from '@nestjs/graphql';
import { JsonValue } from 'type-fest';
import { EnumConnectorRestApiAuthenticationType } from './EnumConnectorRestApiAuthenticationType';
import { PrivateKeyAuthenticationSettings } from './PrivateKeyAuthenticationSettings';
import { HttpBasicAuthenticationSettings } from './HttpBasicAuthenticationSettings';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';

@InputType({
  isAbstract: true
})
export class ConnectorRestApiCreateInput extends BlockCreateInput {
  @Field(() => EnumConnectorRestApiAuthenticationType, {
    nullable: false
  })
  authenticationType!: keyof typeof EnumConnectorRestApiAuthenticationType;

  @Field(() => PrivateKeyAuthenticationSettings, {
    nullable: true
  })
  privateKeyAuthenticationSettings: PrivateKeyAuthenticationSettings &
    JsonValue;

  @Field(() => HttpBasicAuthenticationSettings, {
    nullable: true
  })
  httpBasicAuthenticationSettings: HttpBasicAuthenticationSettings & JsonValue;
}
