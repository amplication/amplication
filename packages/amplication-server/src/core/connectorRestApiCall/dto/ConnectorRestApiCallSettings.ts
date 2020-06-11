import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
@InputType('ConnectorRestApiCallSettingsInput', {
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApiCallSettings {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  url!: string;
}
