import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class CompleteAuthorizeAppWithGithubInput {
  @Field(() => String, {
    nullable: false
  })
  code!: string;

  @Field(() => String, {
    nullable: false
  })
  state!: string;
}
