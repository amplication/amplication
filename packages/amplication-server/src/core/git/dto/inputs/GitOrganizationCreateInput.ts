import { Field, InputType } from "@nestjs/graphql";
import { EnumGitProvider } from "../enums/EnumGitProvider";
import { GitOrganizationCreateInputGitHub } from "./GitOrganizationCreateInputGitHub";
import { GitOrganizationCreateInputAwsCodeCommit } from "./GitOrganizationCreateInputAwsCodeCommit";

@InputType({
  isAbstract: true,
})
export class GitOrganizationCreateInput {
  workspaceId!: string;

  @Field(() => EnumGitProvider, { nullable: false })
  gitProvider!: EnumGitProvider;

  @Field(() => GitOrganizationCreateInputGitHub, { nullable: true })
  githubInput?: GitOrganizationCreateInputGitHub;

  @Field(() => GitOrganizationCreateInputAwsCodeCommit, { nullable: true })
  awsCodeCommitInput?: GitOrganizationCreateInputAwsCodeCommit;
}
