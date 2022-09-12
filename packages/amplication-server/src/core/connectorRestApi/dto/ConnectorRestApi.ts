import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';
import { EnumConnectorRestApiAuthenticationType } from './EnumConnectorRestApiAuthenticationType';
import { PrivateKeyAuthenticationSettings } from './PrivateKeyAuthenticationSettings';
import { HttpBasicAuthenticationSettings } from './HttpBasicAuthenticationSettings';

@ObjectType({
  implements: IBlock,
  isAbstract: true
})
export class ConnectorRestApi extends IBlock {
  @Field(() => EnumConnectorRestApiAuthenticationType, {
    nullable: false
  })
  authenticationType!: keyof typeof EnumConnectorRestApiAuthenticationType;

  @Field(() => PrivateKeyAuthenticationSettings, {
    nullable: true
  })
  privateKeyAuthenticationSettings: PrivateKeyAuthenticationSettings | null;

  @Field(() => HttpBasicAuthenticationSettings, {
    nullable: true
  })
  httpBasicAuthenticationSettings: HttpBasicAuthenticationSettings | null;
}
