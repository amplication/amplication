import { EnumGitProvider } from "../enums/EnumGitProvider";
import { GitOrganizationCreateInputAwsCodeCommit } from "./GitOrganizationCreateInputAwsCodeCommit";
import { GitOrganizationCreateInputGitHub } from "./GitOrganizationCreateInputGitHub";
import { Field, InputType } from "@nestjs/graphql";

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
