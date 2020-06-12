import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';
import { EnumConnectorRestApiAuthenticationType } from './EnumConnectorRestApiAuthenticationType';
import { PrivateKeyAuthenticationSettings } from './PrivateKeyAuthenticationSettings';
import { HttpBasicAuthenticationSettings } from './HttpBasicAuthenticationSettings';

@ObjectType({
  implements: IBlock,
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApi extends IBlock {
  @Field(() => EnumConnectorRestApiAuthenticationType, {
    nullable: false,
    description: undefined
  })
  authenticationType!: keyof typeof EnumConnectorRestApiAuthenticationType;

  @Field(() => PrivateKeyAuthenticationSettings, {
    nullable: true,
    description: undefined
  })
  privateKeyAuthenticationSettings: PrivateKeyAuthenticationSettings | null;

  @Field(() => HttpBasicAuthenticationSettings, {
    nullable: true,
    description: undefined
  })
  httpBasicAuthenticationSettings: HttpBasicAuthenticationSettings | null;
}
