import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true
})
@InputType('HttpBasicAuthenticationSettingsInput', {
  isAbstract: true
})
export class HttpBasicAuthenticationSettings {
  @Field(() => String, {
    nullable: false
  })
  username: string;

  @Field(() => String, {
    nullable: false
  })
  password: string;
}
