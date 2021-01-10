import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class AppEnableSyncWithGithubRepoInput {
  @Field(() => String, {
    nullable: false,
    description: 'The full name of the repo in the format org-name/repo-name'
  })
  githubRepo: string;

  @Field(() => String, {
    nullable: true,
    description: 'optional: defaults to default branch'
  })
  githubBranch?: string | null;
}
