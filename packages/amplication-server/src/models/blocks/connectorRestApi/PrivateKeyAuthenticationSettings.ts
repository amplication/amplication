//import { ConnectorRestApiAuthenticationSettings } from './connectorRestApiAuthenticationSettings';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class PrivateKeyAuthenticationSettings {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  keyName: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  keyValue: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  type: 'header' | 'url';
}
