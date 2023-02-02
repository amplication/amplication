import { EnumPullRequestMode, GitResourceMeta } from "@amplication/git-utils";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { EnumGitProvider } from "../../models";
import { CreateCommit } from "./create-commit.dto";

export class CreatePullRequestArgs {
  @IsString()
  resourceId!: string;
  @IsString()
  @IsOptional()
  oldBuildId?: string | undefined;
  @IsString()
  newBuildId!: string;
  @IsString()
  installationId!: string;
  @IsString()
  gitProvider!: EnumGitProvider;
  @IsString()
  gitOrganizationName!: string;
  @IsString()
  gitRepositoryName!: string;
  @ValidateNested()
  commit: CreateCommit;
  @ValidateNested()
  gitResourceMeta: GitResourceMeta;
  @IsString()
  pullRequestMode: EnumPullRequestMode;
}
