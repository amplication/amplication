//import { ConnectorRestApiAuthenticationSettings } from './connectorRestApiAuthenticationSettings';
import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
@InputType('PrivateKeyAuthenticationSettingsInput', {
  isAbstract: true,
  description: undefined
})
export class PrivateKeyAuthenticationSettings {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  keyName: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  keyValue: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  type: 'header' | 'url';
}
