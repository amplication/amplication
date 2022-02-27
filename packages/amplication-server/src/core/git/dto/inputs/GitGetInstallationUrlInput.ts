import { Field, InputType } from '@nestjs/graphql';
import { EnumGitProvider } from '../enums/EnumGitProvider';

@InputType({
  isAbstract: true
})
export class GitGetInstallationUrlInput {
  @Field(() => String, {
    nullable: false
  })
  workspaceId!: string;

  @Field(() => EnumGitProvider, { nullable: false })
  sourceControlService!: EnumGitProvider;
}
