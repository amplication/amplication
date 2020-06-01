import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
@InputType('HttpBasicAuthenticationSettingsInput', {
  isAbstract: true,
  description: undefined
})
export class HttpBasicAuthenticationSettings {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  username: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  password: string;
}
