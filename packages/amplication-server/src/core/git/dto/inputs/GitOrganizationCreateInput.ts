import { Field, InputType } from '@nestjs/graphql';
import { EnumGitProvider } from '../enums/EnumGitProvider';

@InputType({
  isAbstract: true
})
export class GitOrganizationCreateInput {
  @Field(() => String, {
    nullable: false
  })
  installationId!: string;

  @Field(() => String, { nullable: false })
  workspaceId!: string;

  @Field(() => EnumGitProvider, { nullable: false })
  provider!: EnumGitProvider;
}
