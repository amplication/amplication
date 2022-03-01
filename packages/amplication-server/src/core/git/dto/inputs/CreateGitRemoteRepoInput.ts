import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class CreateGitRemoteRepoInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;
  @Field(() => String, {
    nullable: false
  })
  installationId!: string;
}
