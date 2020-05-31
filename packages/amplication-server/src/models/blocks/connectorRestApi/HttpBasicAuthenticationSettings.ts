//import { ConnectorRestApiAuthenticationSettings } from './connectorRestApiAuthenticationSettings';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class HttpBasicAuthenticationSettings {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  username: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  password: string;
}
