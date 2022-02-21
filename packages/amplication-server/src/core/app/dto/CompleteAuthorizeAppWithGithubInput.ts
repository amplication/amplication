import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class CompleteAuthorizeAppWithGithubInput {
  @Field(() => String, {
    nullable: false
  })
  state!: string;

  @Field(() => String, {
    nullable: false
  })
  installationId!: string;
}
