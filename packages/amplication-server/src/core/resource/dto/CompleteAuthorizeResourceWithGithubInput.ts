import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class CompleteAuthorizeResourceWithGithubInput {
  @Field(() => String, {
    nullable: false,
  })
  state!: string;

  @Field(() => String, {
    nullable: false,
  })
  installationId!: string;
}
