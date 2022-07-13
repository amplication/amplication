//import { ConnectorRestApiAuthenticationSettings } from './connectorRestApiAuthenticationSettings';
import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true
})
@InputType('PrivateKeyAuthenticationSettingsInput', {
  isAbstract: true
})
export class PrivateKeyAuthenticationSettings {
  @Field(() => String, {
    nullable: false
  })
  keyName: string;

  @Field(() => String, {
    nullable: false
  })
  keyValue: string;

  @Field(() => String, {
    nullable: false
  })
  type: 'header' | 'url';
}
